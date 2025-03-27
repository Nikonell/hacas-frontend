<script lang="ts">
    import type {Socket} from "socket.io-client";
    import {type Account, AccountStatus} from "$lib/types/account";
    import type {FormEventHandler} from "svelte/elements";

    interface Props {
        stringInput?: string
        numberValue?: number
        text?: string
        addonText?: string
        style?: string
        accountsSocket?: Socket
        selected?: Account
        onInputChange?: () => void
    }

    let {
        stringInput = $bindable(),
        numberValue = $bindable(),
        text,
        addonText,
        style,
        accountsSocket,
        selected,
        onInputChange
    }: Props = $props()

    $effect(() => {
        if (stringInput && accountsSocket) {
            numberValue = parseInt(stringInput)
        }
        if (stringInput === "") {
            numberValue = undefined;
        } else if (numberValue) {
            stringInput = numberValue.toString();
        }
    })

    let focus: boolean = $state(false);

    const handleKeydown: FormEventHandler<HTMLInputElement> = event => {
        onInputChange?.()
        if (!addonText) return;
        if (accountsSocket && event.data && !event.currentTarget.value.endsWith(` ${addonText}`)) {
            event.currentTarget.value = event.currentTarget.value.trim() + ` ${addonText}`;
            event.currentTarget.setSelectionRange(event.currentTarget.value.length - addonText.length - 1, event.currentTarget.value.length - addonText.length - 1);
        }
        if (event.currentTarget.value === ` ${addonText}` && event.data === null) {
            event.currentTarget.value = "";
        }
    }
</script>

<label>
    {#if text}
        <p>{text}</p>
    {/if}
    <input class:focus type="text" bind:value={stringInput} onfocus={() => focus = true} onblur={() => focus = false} oninput={handleKeydown} style={style} />
</label>

<style lang="scss">
  p {
    padding-left: 20px;
    font-size: 20px;
    line-height: 20px;
    color: #424242;
  }

  input {
    display: flex;
    height: 52px;
    border-radius: 12px;
    box-shadow: inset 0 0 0 1.4px #424242;
    color: white;
    padding-inline: var(--padding, 20px);
    margin: var(--margin, 8px 0 0 0);
    background: var(--background, none);
    background-size: 20px;


    &.focus {
      box-shadow: inset 0 0 0 1.4px #525252;
      outline: none;
    }
  }

  input {
    width: 100%;
  }
</style>