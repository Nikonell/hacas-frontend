<script lang="ts">
    import Accounts from "$lib/components/Accounts.svelte";
    import deleteIcon from "$lib/assets/svg/buttons/delete.svg";
    import {type Account, AccountStatus} from "$lib/types/account";
    import TextInput from "$lib/components/TextInput.svelte";
    import {io, Socket} from "socket.io-client";
    import Card from "$lib/components/Card.svelte";
    import {createTextInputs} from "$lib/data/textInputsData";
    import {createCards} from "$lib/data/cardsData";
    import {onMount} from "svelte";
    import type {GameState} from "$lib/types/gameState";
    import type {MouseEventHandler} from "svelte/elements";
    import {buttons} from "$lib/data/popupButtonsData";
    import Popup from "$lib/components/Popup.svelte";
    import Timer from "$lib/components/Timer.svelte";

    let accounts: Account[] = $state([]);

    const apiUrl = import.meta.env.VITE_WS_BASE_URL;
    const accountsSocket: Socket = io(apiUrl + "/accounts", {transports: ["websocket"], autoConnect: false});
    const gameStateSocket: Socket = io(apiUrl + "/gameState", {transports: ["websocket"], autoConnect: false});

    accountsSocket.emit("getAccounts");

    accountsSocket.on("createAccount", (data: { id: number, account: Account }) => {
        accounts = [...accounts, data.account];
        selectedAccountIDs = getDefaultSelection();
    })
    accountsSocket.on("updateAccount", (data: { id: number, account: Account }) => {
        const accountToUpdate: number | undefined = accounts.findIndex(account => account.id === data.id)
        if (!accountToUpdate) return;
        accounts[accountToUpdate] = data.account;
    })
    accountsSocket.on("deleteAccount", (data: { id: number }) => {
        accounts = accounts.filter(account => account.id !== data.id);
    })

    let gameIsActive: boolean = $state(false);
    
    const getStartButtonText = () => {
        if (gameIsActive) return "стоп"
        else return "старт"
    }


    let selected: Account | undefined = $derived(accounts.find(account => account.id === selectedAccountIDs[0]))

    onMount(() => {
        accountsSocket.connect()
        setTimeout(() => gameStateSocket.connect(), 100)
        setInterval(() => nowTime = Date.now(), 1000);
    })

    let startTime: Date | undefined = $state();
    let nowTime: number = $state(Date.now());

    let realDay = $derived(Math.round((nowTime - (startTime?.getTime() ?? nowTime)) / 1000 / 60 / 60 / 24))
    let realHour = $derived(Math.round((nowTime - (startTime?.getTime() ?? nowTime)) / 1000 / 60 / 60 % 60))
    let realMinute = $derived(Math.round((nowTime - (startTime?.getTime() ?? nowTime)) / 1000 / 60 % 60))

    let gameState: GameState | undefined = $state()

    gameStateSocket.on("updateState", (data: GameState | { state: GameState } ) => {
        const state = 'state' in data ? data.state : data;

        if (state?.startTime) {
            startTime = new Date(state?.startTime);
        }

        gameState = state;

        globalBalance = 0;
        globalPlus = 0;
        if (state.stats) {
            Object.values(state.stats).forEach(o => {
                globalBalance = globalBalance + o.currentBalance;
                globalPlus = globalPlus + o.startBalance;
            });
            if (globalBalance < 0) {
                globalBalance = 0
                globalPlus = 0
            }
            globalPlus = globalBalance - globalPlus;
        }

        if (selected && state.stats?.[selected.id] && state.started) {
            const stats = state.stats[selected.id]
            const { currentBalance } = stats

            const balanceCard = cards.find(card => card.title === "баланс")!

            balanceCard.text = `${currentBalance === -1 ? 0 : currentBalance}$`;

            const balancePercent = (currentBalance * 100) / stats.startBalance - 100
            const balancePositive: boolean = balancePercent > 0;
            balanceCard.tipColor = balancePositive ? "#8CCC4C" : "#C64444"
            let startSym: string = balancePositive ? "+" : "-"

            balanceCard.tip = `${startSym} ${balancePercent}$`;

            const winsCard = cards.find(card => card.title === "выйгрыши")!
            const lossesCard = cards.find(card => card.title === "проигрыши")!
            winsCard.text = `${stats.wins}`;
            lossesCard.text = `${stats.losses}`;
        }

        gameIsActive = state?.started;
    })

    let searchText: string = $state("");
    let selectingMode: boolean = $state(false);
    let haveToDelete: boolean = $state(false);
    let selectedAccountIDs: number[] = $state([]);

    const getFullName = (firstName: string, lastName: string) => {
        return firstName + (lastName ? ' ' + lastName : '');
    }

    function createNumberInput<K extends keyof Account>(key: K) {
        return {
            get: () => selected?.[key] ?? 0,
            set: (value: number | string) => {
                if (selected) selected[key] = Number(value) as Account[K];
            }
        };
    }

    let globalBalance: number = $state(0)
    let globalPlus: number = $state(0)

    const textInputs = createTextInputs({
        bet: createNumberInput("bet"),
        minesCount: createNumberInput("minesCount"),
        timeoutLoss: createNumberInput("timeoutLoss"),
        timeoutPeriod: createNumberInput("timeoutPeriod"),
        spamInterval: createNumberInput("spamInterval"),
        spamTime: createNumberInput("spamTime"),
        lifeTime: createNumberInput("lifeTime")
    });

    const cards = $state(createCards(textInputs))

    let accountIsActive: boolean = $state(false);

    $effect(() => {
        if (!selected) return;
        accountIsActive = selected.status === AccountStatus.ACTIVE;

        const card = cards.find(card => card.toggle);

        if (!card) return;

        if (accountIsActive) {
            if (!gameIsActive) {
                card.text = "включен";
            } else {
                card.text = (selected.id === gameState?.inGameAccount) ? "в игре" : "в ожидании";
            }
        } else {
            card.text = "выключен";
        }
    });

    const onInputChange = () => {
        if (!selected) return;
        accounts = accounts.map(account => account.id === selected.id ? { ...account, status: AccountStatus.INACTIVE } : account);
        accountsSocket.emit("updateAccount", selected);
    }

    function toggleStatus() {
        accountIsActive = !accountIsActive;

        if (selected) {
            accounts = accounts.map(account => account.id === selected.id
                ? { ...account, status: accountIsActive ? AccountStatus.ACTIVE : AccountStatus.INACTIVE }
                : account);
            accountsSocket.emit("updateAccount", selected);
        }
    }
    
    const gameStateChanger: MouseEventHandler<HTMLButtonElement> = () => {
        gameIsActive = !gameIsActive;
        if (gameIsActive) {
            gameStateSocket.emit("startGame");
        } else {
            gameStateSocket.emit("stopGame");
        }
    }

    let showPopup: ((event: MouseEvent) => void) | undefined = $state();
    let closePopup: (() => void) | undefined = $state();

    let removeAccount: (() => void) | undefined = $state();
    let getDefaultSelection: () => [number] | [] = $state(() => []);

    let isAccountPopup: boolean = $state(false);

    const showAccountPopup = (event: MouseEvent) => {
        isAccountPopup = true;
        if (!showPopup) return;
        showPopup(event);
    }

    const showNonAccountPopup = (event: MouseEvent) => {
        isAccountPopup = false;
        if (!showPopup) return;
        showPopup(event);
    }

    $inspect(selectedAccountIDs)
    $inspect(selectingMode)

    let addingTheAccount: boolean = $state(false);

    const filteredPopupButtons = buttons.filter(button => button.text != "удалить");

</script>

<svelte:document onclick={closePopup} />

<aside oncontextmenu={showNonAccountPopup}>
    <TextInput bind:stringInput={searchText} --background="url('/svg/search.svg') no-repeat 24px center" --margin="0 0 20px 0" --padding="68px 20px" />
    <Accounts onShowPopup={showAccountPopup} {searchText} bind:addingTheAccount bind:selectingMode
              bind:haveToDelete bind:accounts bind:selectedAccountIDs {accountsSocket} {gameState} bind:removeAccount bind:getDefaultSelection />

    <Popup buttons={isAccountPopup ? buttons : filteredPopupButtons} bind:showPopup bind:closePopup
           onClick={button => {
           if (button.text === 'удалить' && removeAccount) {
               removeAccount()
           } else if (button.text === 'выделить всё') {
               selectedAccountIDs = accounts.map(account => account.id)
           } else if (button.text === "добавить") {
               addingTheAccount = true;
           }
       }}
    />
</aside>

<section>
    <div class="header">
        <div class="header-things">
            {#if selectedAccountIDs.length > 1}
                <p>выбрано: {selectedAccountIDs.length}</p>
                <button class="functional-button on">включить</button>
                <button class="functional-button off">выключить</button>
                <button class="delete" onclick={() => haveToDelete = true}>
                    <img src={deleteIcon} alt="delete">
                </button>
            {/if}
        </div>

        <div class="header-things header-information">
            <Timer days={realDay} hours={realHour} minutes={realMinute} />
            <p>{`${globalBalance}$`}</p>
            <p style="color: #8CCC4C">{`${globalPlus}$`}</p>
            <button class:gameIsActive class="functional-button stop-game" onclick={gameStateChanger}>{getStartButtonText()}</button>
        </div>
    </div>
    <div class="account-info">
        {#if selectedAccountIDs.length && accounts.length}
            <img class="avatar" src={accounts.find(account => account.id === selectedAccountIDs[0])?.avatarUrl ?? ""} alt="avatar">
            <p>{getFullName(accounts.find(account => account.id === selectedAccountIDs[0])?.firstName ?? "", accounts.find(account => account.id === selectedAccountIDs[0])?.lastName ?? "")}</p>
        {/if}
    </div>
    <div class="account-cards">
        {#each cards as card}
            <div class={card.class}>
                <Card icon={card.icon} title={card.title} text={card.text} tip={card.tip} tipColor={card.tipColor} >
                    {#if card.content}
                        <div class="text-inputs">
                            {#each card.content as textInput}
                                <TextInput bind:numberValue={textInput.inputText} text={textInput.text} addonText={textInput.addonText || undefined} style={textInput.style} {accountsSocket} {selected} {onInputChange} />
                            {/each}
                        </div>
                    {/if}
                    {#if card.toggle}
                        <label class="toggle">
                            <input type="checkbox" bind:checked={accountIsActive} onchange={toggleStatus} />
                            <span class="slider"></span>
                        </label>
                    {/if}
                </Card>
            </div>
        {/each}
    </div>
</section>

<style lang="scss">
    aside {
      width: 520px;
      height: 100%;
      display: flex;
      padding-right: 40px;
      flex-direction: column;
    }

    section {
      flex-grow: 1;
    }

    .header {
      display: flex;
      gap: 20px;
      padding: 8px 0 48px;
      align-items: center;
      justify-content: space-between;
    }

    .functional-button {
      line-height: 100%;
      padding: 8px 0;
      width: 208px;
      border-radius: 8px;
      cursor: pointer;
    }

    .on {
      box-shadow: inset 0 0 0 1.4px #8CCC4C;
    }

    .off {
      box-shadow: inset 0 0 0 1.4px #C64444;
    }

    .delete {
      display: flex;
      padding: 8px;
      border-radius: 8px;
      box-shadow: inset 0 0 0 1.4px #C64444;
      cursor: pointer;
    }

    .header-things {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .header-information {
      float: right;
    }

    .stop-game {
      background-color: #8CCC4C;
      
      &.gameIsActive {
        background-color: #C64444;
      }
    }

    .account-info {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-bottom: 40px;

      p {
        font-size: 32px;
      }
    }

    .avatar {
      width: 104px;
      border-radius: 100%;
    }

    .account-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 116px 116px;
      gap: 40px;
    }

    .large-box {
      grid-column: 1;
      grid-row: span 3;
      background-color: #1c1c1c;
      border-radius: 10px;
      height: fit-content;
      padding: 20px;
    }

    .small-box {
      background-color: #1c1c1c;
      border-radius: 10px;
      height: 116px;
    }

    .top {
      display: flex;
      grid-column: 2;
      grid-row: 1;
      padding: 20px;
      flex-direction: column;
      background: linear-gradient(90deg, #1F1F1F 0%, #22271C 100%);
    }

    .middle-left {
      grid-column: 2;
      grid-row: 2;
      width: calc((100% - 40px) / 2);
      padding: 20px;
    }

    .middle-right {
      grid-column: 2;
      grid-row: 2;
      justify-self: end;
      width: calc((100% - 40px) / 2);
      padding: 20px;
    }

    .bottom {
      display: flex;
      grid-column: 2;
      grid-row: 3;
      padding: 20px;
      position: relative;
      flex-direction: column;
    }

    .text-inputs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto auto;
      gap: 20px;
    }

    .bottom {
      mask: url("../lib/assets/svg/cards/subtract.svg") center top no-repeat, linear-gradient(#000000, #000000);
      mask-composite: exclude;
      background: linear-gradient(90deg, #1f1f1f 0%, #27221c 100%);;
    }

    .toggle {
      display: flex;
      width: 48px;
      height: 24px;
      cursor: pointer;
      padding: 6px;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, 0);
    }

    .toggle input {
      display: none;
    }

    .slider {
      width: 12px;
      height: 12px;
      background-color: #424242;
      border-radius: 50%;
      transition: transform 0.3s, background-color 0.3s;

      input:checked + & {
        transform: translateX(24px);
        background-color: #8CCC4C;
      }
    }

</style>