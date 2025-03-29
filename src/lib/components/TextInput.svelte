<script lang="ts">
    import type {FormEventHandler} from "svelte/elements";

    interface Props {
        stringInput?: string
        value?: string | number
        text?: string
        addonText?: string
        style?: string
        onInputChange?: () => void
        type: "string" | "number"
    }

    let {
        stringInput,
        value = $bindable(),
        text,
        addonText,
        style,
        onInputChange,
        type
    }: Props = $props()

    let focus: boolean = $state(false);

    $effect(() => {
        stringInput = (value ?? "").toString().trim() + (!focus && addonText ? ` ${addonText}` : "");
    })

    const handleKeydown: FormEventHandler<HTMLInputElement> = event => {
        if (!stringInput) return;
        value = type === "number" ? parseInt(stringInput) : stringInput

        onInputChange?.()
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