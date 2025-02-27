<script lang="ts">
    import Accounts from "../components/Accounts.svelte";
    import deleteButton from "../../static/accounts/buttons/delete.svg";
    import {type Account, AccountStatus} from "../data/accountsUI";

    let searchText: string = $state("");
    let countOfSelectedAccounts: number = $state(0);
    let selectingMode: boolean = $state(false);
    let haveToDelete: boolean = $state(false);
    let selectedAccountIDs: number[] = $state([]);

    let accounts: Account[] = $state([
        {id: 1, username: 'abubaa', firstName: 'Абубачир', lastName: '', avatarUrl: 'https://media.discordapp.net/attachments/1012689568740417546/1335981071833239552/clockawo_1.png?ex=67bbda14&is=67ba8894&hm=936cb94df7ad41cf3465dccd80bcf550a66bcb4ab857594e1af002a8364b2897&=&format=webp&quality=lossless&width=676&height=676', token: 'sagadsf', bet: 5, minesCount: 3, timeoutLoss: 12, timeoutPeriod: 23, spamInterval: 20, spamTime: 10, status: AccountStatus.INACTIVE},
        {id: 2, username: 'abubaa', firstName: 'Абубачир', lastName: '', avatarUrl: 'https://media.discordapp.net/attachments/1012689568740417546/1335981071833239552/clockawo_1.png?ex=67bbda14&is=67ba8894&hm=936cb94df7ad41cf3465dccd80bcf550a66bcb4ab857594e1af002a8364b2897&=&format=webp&quality=lossless&width=676&height=676', token: 'sagadsf', bet: 5, minesCount: 3, timeoutLoss: 12, timeoutPeriod: 23, spamInterval: 20, spamTime: 10, status: AccountStatus.INACTIVE},
        {id: 3, username: 'abuba', firstName: 'Ыбыба', lastName: 'Трахов', avatarUrl: 'https://media.discordapp.net/attachments/1012689568740417546/1335981071833239552/clockawo_1.png?ex=67bbda14&is=67ba8894&hm=936cb94df7ad41cf3465dccd80bcf550a66bcb4ab857594e1af002a8364b2897&=&format=webp&quality=lossless&width=676&height=676', token: 'sagadsf', bet: 5, minesCount: 3, timeoutLoss: 12, timeoutPeriod: 23, spamInterval: 20, spamTime: 10, status: AccountStatus.ACTIVE},
        {id: 4, username: 'abuba', firstName: 'Ыбыба', lastName: 'Трахов', avatarUrl: 'https://media.discordapp.net/attachments/1012689568740417546/1335981071833239552/clockawo_1.png?ex=67bbda14&is=67ba8894&hm=936cb94df7ad41cf3465dccd80bcf550a66bcb4ab857594e1af002a8364b2897&=&format=webp&quality=lossless&width=676&height=676', token: 'sagadsf', bet: 5, minesCount: 3, timeoutLoss: 12, timeoutPeriod: 23, spamInterval: 20, spamTime: 10, status: AccountStatus.ACTIVE},
        {id: 5, username: 'abuba', firstName: 'ЯКОНЧ', lastName: '', avatarUrl: 'https://media.discordapp.net/attachments/1012689568740417546/1335981071833239552/clockawo_1.png?ex=67bbda14&is=67ba8894&hm=936cb94df7ad41cf3465dccd80bcf550a66bcb4ab857594e1af002a8364b2897&=&format=webp&quality=lossless&width=676&height=676', token: 'sagadsf', bet: 5, minesCount: 3, timeoutLoss: 12, timeoutPeriod: 23, spamInterval: 20, spamTime: 10, status: AccountStatus.ACTIVE},
        {id: 6, username: 'abuba', firstName: 'ЯКОНЧ', lastName: '', avatarUrl: 'https://media.discordapp.net/attachments/1012689568740417546/1335981071833239552/clockawo_1.png?ex=67bbda14&is=67ba8894&hm=936cb94df7ad41cf3465dccd80bcf550a66bcb4ab857594e1af002a8364b2897&=&format=webp&quality=lossless&width=676&height=676', token: 'sagadsf', bet: 5, minesCount: 3, timeoutLoss: 12, timeoutPeriod: 23, spamInterval: 20, spamTime: 10, status: AccountStatus.ACTIVE}
    ]);

    $inspect(selectedAccountIDs);

    const getFullName = (firstName: string, lastName: string) => {
        return firstName + (lastName ? ' ' + lastName : '');
    }
</script>

<aside>
    <input type="text" class="text-input search" bind:value={searchText} />
    <Accounts {searchText} bind:countOfSelectedAccounts={countOfSelectedAccounts} bind:selectingMode={selectingMode}
              bind:haveToDelete={haveToDelete} bind:accounts={accounts} bind:selectedAccountIDs={selectedAccountIDs} />
</aside>

<section>
    <div class="header">
        <div class="header-things">
            {#if selectingMode === false && countOfSelectedAccounts > 1}
                <p>выбрано: {countOfSelectedAccounts}</p>
                <button class="functional-button on">включить</button>
                <button class="functional-button off">выключить</button>
                <button class="delete" onclick={() => haveToDelete = true}>
                    <img src="{deleteButton}" alt="delete">
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
        {#if selectedAccountIDs.length}
            <img class="avatar" src={accounts[selectedAccountIDs[0] - 1].avatarUrl} alt="avatar">
            <p>{getFullName(accounts[selectedAccountIDs[0] - 1].firstName, accounts[selectedAccountIDs[0] - 1].lastName)}</p>
        {/if}
    </div>
    <div class="account-placeholders">
        <div class="large-box account-settings"></div>
        <div class="small-box top account-balance"></div>
        <div class="small-box middle-left account-wins"></div>
        <div class="small-box middle-right account-losses"></div>
        <div class="small-box bottom account-status"></div>
    </div>
</section>

<style lang="scss">
    :global(body) {
      background-color: #0f0f0f;
      height: 100vh;
      margin: 0;
      display: flex;
    }

    aside {
      width: 520px;
      height: 100%;
      display: flex;
      padding: 0 40px;
      flex-direction: column;
    }

    .text-input {
      margin-top: 40px;
      margin-bottom: 20px;
      height: 52px;
      border-radius: 12px;
      border: none;
      box-shadow: inset 0 0 0 1.4px #424242;
      color: white;
    }

    .text-input:focus {
      box-shadow: inset 0 0 0 1.4px #525252;
      outline: none;
    }

    .search {
      padding-left: 68px;
      padding-right: 20px;
      background: url('/accounts/buttons/search.svg') no-repeat 24px center;
      background-size: 20px;
    }

    section {
      flex-grow: 1;
      padding-right: 40px;
    }

    .header {
      display: flex;
      gap: 20px;
      padding: 48px 0;
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

    .account-placeholders {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto auto;
      gap: 40px;
      width: 100%;
      height: 250px;
    }

    .large-box {
      background-color: #1c1c1c;
      border-radius: 10px;
      height: auto;
    }

    .small-box {
      background-color: #1c1c1c;
      border-radius: 10px;
      height: 116px;
    }

    .top {
      grid-column: 2;
    }

    .middle-left {
      grid-column: 2;
      grid-row: 2;
      width: calc((100% - 40px) / 2);
    }

    .middle-right {
      grid-column: 2;
      grid-row: 2;
      justify-self: end;
      width: calc((100% - 40px) / 2);
    }

    .bottom {
      grid-column: 2;
      grid-row: 3;
    }

</style>