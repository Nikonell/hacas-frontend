<script lang="ts">
    interface Props {
        time: number
        timeText: string
    }
    let {
        time,
        timeText
    }: Props = $props()
</script>

<div>
    <p class="time">{time}</p>
    <p class="time-text">{timeText}</p>
</div>

<style lang="scss">
    div {
      display: flex;
      gap: 4px;
    }
    .time-text {
      color: #424242;
    }
    .time {
      color: white;
    }
</style>