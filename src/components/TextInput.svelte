<script lang="ts">
    import type {Socket} from "socket.io-client";
    import type {Account} from "../data/accountsUI";
    import type {FormEventHandler, KeyboardEventHandler} from "svelte/elements";

    interface Props {
        stringInput?: string
        numberValue?: number
        text?: string
        addonText?: string
        style?: string
        accountsSocket?: Socket
        selected?: Account
    }

    let {
        stringInput,
        numberValue = $bindable(),
        text,
        addonText,
        style,
        accountsSocket,
        selected
    }: Props = $props()

    $effect(() => {
        if (stringInput && accountsSocket) {
            if (!addonText) {
                numberValue = Number(stringInput.trim());
            }
            if (addonText && stringInput.includes(addonText)) {
                numberValue = Number(stringInput.trim().slice(0, -addonText.length - 1));
            }
            if (addonText && !stringInput.includes(addonText)) {
                numberValue = Number(stringInput.trim());
            }
            accountsSocket.emit("updateAccount", selected);
        }
        if (numberValue) {
            stringInput = numberValue.toString()
        }
    })

    let focus: boolean = $state(false);

    const handleKeydown: FormEventHandler<HTMLInputElement> = event => {
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
    margin: var(--margin, 8px 0 20px 0);
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