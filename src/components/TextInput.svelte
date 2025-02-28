<script lang="ts">
    interface Props {
        inputText: string
        text?: string
        addonText?: string
    }

    let {
        inputText = $bindable(),
        text,
        addonText
    }: Props = $props()

    let focus: boolean = $state(false);

    function handleKeydown(event: KeyboardEvent) {
        if (addonText && event.target !== null) {
            if (!event.target.value.endsWith(` ${addonText}`)) {
                event.target.value = event.target.value.trim() + ` ${addonText}`;
                inputText = event.target.value;
                event.target.setSelectionRange(event.target.value.length - addonText.length - 1, event.target.value.length - addonText.length - 1);
            }
        }
    }
</script>

<label>
    {#if text}
        <p>{text}</p>
    {/if}
    <input class:focus type="text" bind:value={inputText} onfocus={() => focus = true} onblur={() => focus = false} onkeydown={event => handleKeydown(event)}>
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

  img {
    width: 20px;
    pointer-events: none;
    user-select: none;
  }
</style>