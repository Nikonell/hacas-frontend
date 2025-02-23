<script lang="ts">
    import {type Account, AccountStatus} from "../data/accountsUI";
    import {accounts} from "../data/accountsData";
    import { onMount } from "svelte";
    import {buttons} from "../data/PopupButtonsData";
    import PopupButtons from "./PopupButtons.svelte";

    let popupVisible = false;
    let popupX = 0;
    let popupY = 0;
    let selectedPopupAccount: Account | null = null;

    function showPopup(event: MouseEvent, account: Account) {
        event.preventDefault(); // Отменяем стандартное контекстное меню
        selectedPopupAccount = account;
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

    let sortedAccounts = structuredClone(accounts).sort((_, b) => b.status === 'active' ? 1 : -1);
    let firstInactiveIndex = sortedAccounts.findIndex(account => account.status === 'inactive');

    function removeAccount(account: Account | null) {
        sortedAccounts = sortedAccounts.filter(x => x.id !== account?.id);
        firstInactiveIndex = sortedAccounts.findIndex(account => account.status === 'inactive');
        console.log(sortedAccounts);
    }

    let selectedAccountId: number | null = sortedAccounts[0].status === AccountStatus.ACTIVE ? sortedAccounts[0].id : null;

    function selectAccount(id: number) {
        selectedAccountId = id;
    }
</script>

{#each sortedAccounts as account, index}
    {#if index === firstInactiveIndex && index !== 0}
        <p class="inactive-separator">неактивные</p>
    {/if}

    <a href="/"
       class="btn {selectedAccountId === account.id ? 'selected' : ''} {account.status === 'inactive' ? 'inactive' : ''}"
       onclick={() => selectAccount(account.id)}
       oncontextmenu={(event) => showPopup(event, account)}>
        <div class="side-card-text">
            <img src={account.avatarUrl} alt="account icon" />
            <p class="account-card-name">{account.lastName === '' ? account.firstName : account.firstName + ' ' + account.lastName}</p>
        </div>
        {#if account.status === 'active'}
            <div class="side-card-text">
                <p class="account-card-balance">$16.41</p>
                <p class="account-card-plus">+$20.32</p>
            </div>
        {/if}
    </a>
{/each}

{#if popupVisible}
    <div class="popup" style="top: {popupY}px; left: {popupX}px;">
    {#each buttons as button}
        <PopupButtons
                icon={button.icon}
                text={button.text}
                color={button.color}
                onclick={() => {
                    if (button.text === 'удалить') {
                        removeAccount(selectedPopupAccount)
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
    font-size: 20px;
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
    font-size: 20px;
    color: #424242;
  }

  .inactive {
    pointer-events: none;
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
</style>