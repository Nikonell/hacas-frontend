<script lang="ts">

import Accounts from "../components/Accounts.svelte";
</script>

<aside>
    <input type="text" class="search">
    <Accounts/>
</aside>

<section>

</section>

<style lang="scss">
    :global(body) {
        background-color: #0f0f0f;
        height: 100vh;
        margin: 0;
    }

    aside {
      width: 520px;
      height: 100%;
      display: flex;
      padding: 0 40px;
      flex-direction: column;
    }

    .search {
      margin-top: 40px;
      margin-bottom: 20px;
      height: 52px;
      padding-left: 68px;
      padding-right: 20px;
      background: url('/accounts/buttons/search.svg') no-repeat 24px center;
      background-size: 20px;
      border-radius: 12px;
      border: none;
      box-shadow: inset 0 0 0 1.4px #424242;
      color: white;
      font-size: 20px;
    }

    .search:focus {
      box-shadow: inset 0 0 0 1.4px #525252;
      outline: none;
    }
</style>