<script lang="ts">
    import Time from "./Time.svelte";

    interface Props {
        days: number | undefined;
        hours: number | undefined;
        minutes: number | undefined;
    }

    let {
        days,
        hours,
        minutes
    }: Props = $props();

    let times = $derived([
        { time: days, timeText: "дн" },
        { time: hours, timeText: "ч" },
        { time: minutes, timeText: "мин" }
    ]);

</script>

<div>
    {#each times as time}
        {#if time.time}
            <Time time={time.time} timeText={time.timeText} />
        {/if}
    {/each}
</div>

<style lang="scss">
    div {
      display: flex;
      gap: 8px;
    }

</style>