<script lang="ts">
    import type {MouseEventHandler} from "svelte/elements";

    interface Props {
        icon: string;
        text: string;
        color: string;
        onclick: MouseEventHandler<HTMLButtonElement>;
    }

    let {
        icon,
        text,
        color,
        onclick,
    }: Props = $props()
</script>

<button style="color: #{color};" {onclick}>
    <img src={icon} alt="button-ico">
    {text}
</button>

<style lang="scss">
  button {
    display: flex;
    align-items: center;
    border: none;
    height: 36px;
    border-radius: 4px;
    padding: 0 0 0 20px;
    gap: 20px;
    background: none;
  }

  button:hover {
    background-color: #1F1F1F;
  }
</style>