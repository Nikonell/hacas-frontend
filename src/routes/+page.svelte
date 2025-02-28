<script lang="ts">
    import Accounts from "../components/Accounts.svelte";
    import deleteIcon from "../../static/accounts/buttons/delete.svg";
    import settingsIcon from "../placeholders/settings.svg";
    import {type Account, AccountStatus} from "../data/accountsUI";
    import TextInput from "../components/TextInput.svelte";

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

    const getFullName = (firstName: string, lastName: string) => {
        return firstName + (lastName ? ' ' + lastName : '');
    }

    let betSize: string = $state("")
    let minesAmount: string = $state("")
    let stopAfter: string = $state("")
    let stopTime: string = $state("")
    let spamInterval: string = $state("")
    let spamTime: string = $state("")
</script>

<aside>
    <TextInput inputText={searchText} --background="url('/accounts/buttons/search.svg') no-repeat 24px center" --margin="0 0 20px 0" --padding="68px 20px" />
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
        {#if selectedAccountIDs.length}
            <img class="avatar" src={accounts[selectedAccountIDs[0] - 1].avatarUrl} alt="avatar">
            <p>{getFullName(accounts[selectedAccountIDs[0] - 1].firstName, accounts[selectedAccountIDs[0] - 1].lastName)}</p>
        {/if}
    </div>
    <div class="account-placeholders">
        <div class="large-box">
            <div class="placeholder-name">
                <img src={settingsIcon} alt="settings-icon">
                <p>настройки</p>
            </div>
            <div class="placeholders">
                <TextInput inputText={betSize} text="размер ставки" --background="url('/accounts/buttons/dollar-sign.svg') no-repeat right 20px center" --padding="20px 60px" />
                <TextInput inputText={stopAfter} text="приостановка после" />
                <TextInput inputText={spamInterval} text="интервал спама" />
                <TextInput inputText={minesAmount} text="сколько мин" --background="url('/accounts/buttons/cpu.svg') no-repeat right 20px center" --padding="20px 60px" />
                <TextInput inputText={stopTime} text="время приостановки" addonText="мин." />
                <TextInput inputText={spamTime} text="время спама" addonText="мс." />
            </div>
        </div>
        <div class="small-box top account-balance">

        </div>
        <div class="small-box middle-left"></div>
        <div class="small-box middle-right"></div>
        <div class="small-box bottom"></div>
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

    .account-placeholders {
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
      height: 364px;
      padding: 20px;
    }

    .small-box {
      background-color: #1c1c1c;
      border-radius: 10px;
      height: 116px;
    }

    .top {
      grid-column: 2;
      grid-row: 1;
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

    .placeholder-name {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;

      img {
        background-color: #3F3F3F;
        width: 24px;
        height: 24px;
        padding: 4px;
        border-radius: 4px;
      }
    }

    .placeholders {
      column-count: 2;
      column-gap: 20px;
    }

</style>