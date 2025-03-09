<script lang="ts">

    import type {Snippet} from "svelte";

    interface Props {

        icon: string;
        title: string;
        text?: string;
        tip?: string;
        children?: Snippet;
    }

    let {
        icon,
        title,
        text,
        tip,
        children
    }: Props = $props()

</script>

<div class="card-header">
    <div class="card-name">
        <img src={icon} alt="icon">
        <p>{title}</p>
    </div>
    {#if tip}
        <p class="tip">{tip}</p>
    {/if}
</div>
{#if text}
    <p class="card-text">{text}</p>
{/if}
{@render children?.()}

<style lang="scss">

  .card-header {
    display: flex;
    align-self: start;
    width: 100%;
    justify-content: space-between;
  }

  .card-name {
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

  .tip {
    align-self: start;
    font-size: 16px;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #8CCC4C;
  }

  .card-text {
    font-size: 32px;
  }
</style>