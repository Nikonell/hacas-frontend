<script lang="ts">
    import PopupButton from "./PopupButton.svelte";

    interface Props {
        buttons: {icon: string; text: string; color: string}[];
        onClick?: (button: {icon: string; text: string; color: string}) => void;
        showPopup?: (event: MouseEvent) => void;
        closePopup?: () => void;
    }

    let {
        buttons,
        onClick,
        showPopup = $bindable(),
        closePopup = $bindable(),
    }: Props = $props()

    let popupVisible = $state(false);
    let popupX = $state(0);
    let popupY = $state(0);

    showPopup = (event: MouseEvent) => {
        event.preventDefault(); // Отменяем стандартное контекстное меню
        event.stopPropagation();
        popupX = event.clientX;
        popupY = event.clientY;
        popupVisible = true;
    }

    closePopup = () => {
        popupVisible = false;
    }
</script>

{#if popupVisible}
    <div class="popup" style="top: {popupY}px; left: {popupX}px;">
        {#each buttons as button}
            <PopupButton
                    icon={button.icon}
                    text={button.text}
                    color={button.color}
                    onclick={() => {onClick?.(button)}}
            ></PopupButton>
        {/each}
    </div>
{/if}

<style lang="scss">
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