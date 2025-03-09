<script lang="ts">
    import Accounts from "../components/Accounts.svelte";
    import deleteIcon from "../../static/accounts/buttons/delete.svg";
    import {type Account, AccountStatus} from "../data/accountsUI";
    import TextInput from "../components/TextInput.svelte";
    import {io, Socket} from "socket.io-client";
    import Card from "../components/Card.svelte";
    import {createTextInputs} from "../data/TextInputsData";
    import {createCards} from "../data/CardsData";

    let accounts: Account[] = $state([]);

    const apiUrl = import.meta.env.VITE_WS_BASE_URL;
    const accountsSocket: Socket = io(apiUrl + "/accounts", {transports: ["websocket"]});
    const gameStateSocket: Socket = io(apiUrl + "/gameState", {transports: ["websocket"]});

    accountsSocket.emit("getAccounts");
    accountsSocket.on("getAccounts", (data: { accounts: Account[] }) => {
        accounts = data.accounts;
    })

    accountsSocket.on("createAccount", (data: { id: number, account: Account }) => {
        accounts.push(data.account);
    })
    accountsSocket.on("updateAccount", (data: { id: number, account: Account }) => {
        const accountToUpdate: number | undefined = accounts.findIndex(account => account.id === data.id)
        if (!accountToUpdate) return;
        accounts[accountToUpdate] = data.account;
    })
    accountsSocket.on("deleteAccount", (data: { id: number }) => {
        const accountToRemove: number | undefined = accounts.findIndex(account => account.id === data.id)
        if (!accountToRemove) return;
        accounts.splice(accountToRemove, 1);
    })

    let searchText: string = $state("");
    let countOfSelectedAccounts: number = $state(0);
    let selectingMode: boolean = $state(false);
    let haveToDelete: boolean = $state(false);
    let selectedAccountIDs: number[] = $state([]);

    const getFullName = (firstName: string, lastName: string) => {
        return firstName + (lastName ? ' ' + lastName : '');
    }

    let selected: Account | undefined = $derived(accounts.find(account => account.id === selectedAccountIDs[0]))

    function createNumberInput<K extends keyof Account>(key: K) {
        return {
            get: () => selected?.[key] ?? 0,
            set: (value: number | string) => {
                if (selected) selected[key] = Number(value) as Account[K];
            }
        };
    }

    const textInputs = createTextInputs({
        bet: createNumberInput("bet"),
        minesCount: createNumberInput("minesCount"),
        timeoutLoss: createNumberInput("timeoutLoss"),
        timeoutPeriod: createNumberInput("timeoutPeriod"),
        spamInterval: createNumberInput("spamInterval"),
        spamTime: createNumberInput("spamTime"),
    });

    const cards = createCards(textInputs)

    let statusChecker: boolean = $state(false);
    $effect(() => {
        if (selected) {
            if (statusChecker) {
                selected.status = AccountStatus.ACTIVE;
                accountsSocket.emit("updateAccount", selected);
            }
        }
    })
</script>

<aside>
    <TextInput stringInput={searchText} --background="url('/accounts/buttons/search.svg') no-repeat 24px center" --margin="0 0 20px 0" --padding="68px 20px" />
    <Accounts {searchText} bind:countOfSelectedAccounts={countOfSelectedAccounts} bind:selectingMode={selectingMode}
              bind:haveToDelete={haveToDelete} bind:accounts={accounts} bind:selectedAccountIDs={selectedAccountIDs} {accountsSocket} />
</aside>

<section>
    <div class="header">
        <div class="header-things">
            {#if selectingMode === false && countOfSelectedAccounts > 1}
                <p>выбрано: {countOfSelectedAccounts}</p>
                <button class="functional-button on">включить</button>
                <button class="functional-button off">выключить</button>
                <button class="delete" onclick={() => haveToDelete = true}>
                    <img src={deleteIcon} alt="delete">
                </button>
            {/if}
        </div>

        <div class="header-things header-information">
            <p>312.32$</p>
            <p style="color: #8CCC4C">124.26$</p>
            <button class="functional-button stop-game">стоп</button>
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
                <Card icon={card.icon} title={card.title} text={card.text} tip={card.tip}>
                    {#if card.content}
                        <div class="text-inputs">
                            {#each card.content as textInput}
                                {#if textInput.addonText.length}
                                    <TextInput bind:numberValue={textInput.inputText} text={textInput.text} addonText={textInput.addonText} style={textInput.style} {accountsSocket} {selected} />
                                {:else}
                                    <TextInput bind:numberValue={textInput.inputText} text={textInput.text} style={textInput.style} {accountsSocket} {selected} />
                                {/if}
                            {/each}
                        </div>
                    {/if}
                    {#if card.toggle}
                        <label class="toggle">
                            <input type="checkbox" bind:checked={statusChecker} />
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
      background-color: #C64444;
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
      grid-template-rows: auto auto auto;
      gap: 40px;
      width: 100%;
      height: 250px;
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
      column-count: 2;
      column-gap: 20px;
    }

    .bottom {
      mask: url("../cards/subtract.svg") center top no-repeat, linear-gradient(#000000, #000000);
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