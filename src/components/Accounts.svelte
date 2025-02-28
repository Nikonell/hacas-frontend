<script lang="ts">
    import {type Account, AccountStatus} from "../data/accountsUI";
    import {onMount} from "svelte";
    import {buttons} from "../data/PopupButtonsData";
    import PopupButtons from "./PopupButtons.svelte";

    interface Props {
        searchText: string;
        countOfSelectedAccounts: number;
        selectingMode: boolean;
        haveToDelete: boolean;
        accounts: Account[]
        selectedAccountIDs: number[]
    }

    let {
        searchText,
        countOfSelectedAccounts = $bindable(),
        selectingMode = $bindable(),
        haveToDelete = $bindable(),
        accounts = $bindable(),
        selectedAccountIDs = $bindable()
    }: Props = $props()

    let addingTheAccount = $state(false);

    let popupVisible = $state(false);
    let popupX = $state(0);
    let popupY = $state(0);
    let selectedPopupAccountID: number | null = null;

    let telegramKey: string | null = null;

    function showPopup(event: MouseEvent) {
        event.preventDefault(); // Отменяем стандартное контекстное меню
        popupX = event.clientX;
        popupY = event.clientY;
        popupVisible = true;
    }

    function closePopup() {
        popupVisible = false;
    }

    onMount(() => {
        document.addEventListener("click", closePopup);
    });

    const getFullName = (firstName: string, lastName: string) => {
        return firstName + (lastName ? ' ' + lastName : '');
    }

    const displayedAccounts = $derived({
        active: accounts.filter(account => account.status === AccountStatus.ACTIVE &&
            getFullName(account.firstName, account.lastName).toLowerCase().includes(searchText.toLowerCase())),
        inactive: accounts.filter(account => account.status === AccountStatus.INACTIVE &&
            getFullName(account.firstName, account.lastName).toLowerCase().includes(searchText.toLowerCase())),
    });

    const getDefaultSelection = () => {
        const foundActive = accounts.find(account => account.status === AccountStatus.ACTIVE)
        return foundActive ? [foundActive.id] : (accounts.length ? [1] : []);
    }

    selectedAccountIDs = getDefaultSelection();

    function removeAccount() {
        let selectedCopy: number[] = selectedAccountIDs

        // Удаление аккаунтов из списка
        if (selectedAccountIDs.length === 1) {
            const index = accounts.findIndex(account => account.id === selectedPopupAccountID);
            if (index === -1) return;
            accounts.splice(index, 1);
        } else {
            selectedAccountIDs.forEach(selectedAccountID => {
                const index = accounts.findIndex(account => account.id === selectedAccountID);
                if (index === -1) return;
                accounts.splice(index, 1);
            });
        }

        const firstAvailable = getDefaultSelection();
        if (haveToDelete) {
            countOfSelectedAccounts = 1;
            console.log(countOfSelectedAccounts)
        }

        if (selectedPopupAccountID !== null && selectedCopy.includes(selectedPopupAccountID) && selectedCopy.length === 1) {
            selectedAccountIDs = firstAvailable;
        } else if (selectedCopy.length > 1) {
            selectedAccountIDs = firstAvailable;
        }
    }

    $effect(() => {
        if (haveToDelete) {
            removeAccount();
            haveToDelete = false;
        }
    });

    selectingMode = false;

    function selectAccount(id: number, event: MouseEvent) {
        if (selectingMode || event.ctrlKey && !selectedAccountIDs.includes(id)) {
            selectedAccountIDs.push(id);
        } else if (event.ctrlKey && selectedAccountIDs.includes(id)) {
            selectedAccountIDs = selectedAccountIDs.filter(accountId => accountId !== id);
        } else {
            selectedAccountIDs = [id];
        }

        if (event.buttons === 2) {
            selectedAccountIDs = [id];
        }

        countOfSelectedAccounts = selectedAccountIDs.length;
    }

    function moveSelection(event: MouseEvent, account: Account) {
        if (selectingMode && !selectedAccountIDs.includes(account.id) && event.buttons === 1) selectAccount(account.id, event);
    }
</script>

<svelte:document onmouseup={() => selectingMode = false}/>

{#snippet accountsDisplay(accounts: Account[])}
    {#each accounts as account}
        <a href="/"
           class="btn {selectedAccountIDs.includes(account.id) ? 'selected' : ''}"
           onclick={event => {
               event.preventDefault();
               selectAccount(account.id, event)
           }}
           oncontextmenu={(event) => showPopup(event)}
           onmousedown={event => {
               selectingMode = true;
               if (event.buttons === 2) selectedPopupAccountID = account.id;
               if (event.buttons === 2 && selectedPopupAccountID !== null && !selectedAccountIDs.includes(selectedPopupAccountID)) selectAccount(account.id, event)
           }}
           onmousemove={event => moveSelection(event, account)}
           ondragstart={event => event.preventDefault()}
        >
            <div class="side-card-text">
                <img src={account.avatarUrl} alt="account icon" />
                <p class="account-card-name">{getFullName(account.firstName, account.lastName)}</p>
            </div>
            {#if account.status === AccountStatus.ACTIVE}
                <div class="side-card-text">
                    <p class="account-card-balance">$16.41</p>
                    <p class="account-card-plus">+$20.32</p>
                </div>
            {/if}
        </a>
    {/each}
{/snippet}

{#if addingTheAccount}
    <input type="text" class="add-new-account" onkeydown={event => {if (event.key === 'Enter') {
        addingTheAccount = false
        if (event.target !== null) telegramKey = event.target.value;
        console.log(telegramKey)
    }}}>
{/if}

{@render accountsDisplay(displayedAccounts.active)}
{#if displayedAccounts.inactive.length && displayedAccounts.active.length}
    <p class="inactive-separator">неактивные</p>
{/if}
{@render accountsDisplay(displayedAccounts.inactive)}

{#if popupVisible}
    <div class="popup" style="top: {popupY}px; left: {popupX}px;">
        {#each buttons as button}
            <PopupButtons
                    icon={button.icon}
                    text={button.text}
                    color={button.color}
                    onclick={() => {
                    if (button.text === 'удалить') {
                        removeAccount()
                    } else if (button.text === 'выделить всё') {
                        selectedAccountIDs = []
                        countOfSelectedAccounts = accounts.length
                        accounts.forEach((account) => {
                            selectedAccountIDs.push(account.id)
                        })
                    } else if (button.text === "добавить") {
                        addingTheAccount = true
                    }
                }}
            ></PopupButtons>
        {/each}
    </div>
{/if}

<style lang="scss">
  .btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 52px;
    background-color: #1F1F1F;
    border-radius: 12px;
    margin-top: 20px;
    padding: 0 20px;
    color: white;
    text-decoration: none;

    img {
      width: 28px;
      height: 28px;
      border-radius: 320px
    }
  }

  .account-card-name {
    white-space: nowrap;       /* Запрещает перенос текста */
    overflow: hidden;          /* Обрезает текст, если он не помещается */
    text-overflow: ellipsis;   /* Добавляет "..." в конце */
    max-width: 200px;
  }

  .side-card-text {
    display: flex;
    gap: 20px;

    p {
      margin: 0;
    }
  }

  .account-card-plus {
    color: #8CCC4C;
  }

  .selected {
    box-shadow: inset 0 0 0 1.4px #525252;
    border-radius: 8px;
  }

  .inactive-separator {
    margin: 28px 0 0;
    color: #424242;
  }

  .popup {
    display: flex;
    flex-direction: column;
    position: absolute;
    box-shadow: inset 0 0 0 1.4px #424242;
    background: #0F0F0F;
    padding: 8px;
    border-radius: 12px;
    width: 200px;
    z-index: 100;
  }

  .add-new-account {
    margin-top: 20px;
    margin-bottom: 0;
    height: 52px;
    padding-left: 68px;
    padding-right: 20px;
    background: url('/accounts/buttons/add.svg') no-repeat 24px center;
    background-size: 20px;
    border-radius: 12px;
    border: none;
    box-shadow: inset 0 0 0 1.4px #424242;
    color: white;
  }

  .add-new-account:focus {
    box-shadow: inset 0 0 0 1.4px #525252;
    outline: none;
  }
</style>