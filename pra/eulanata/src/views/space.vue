<template>
  <div class="space">
      <img :src="img" alt="">
      <p>出错啦~</p>
  </div>
</template>

<script>
export default {
    name:'space',
    data() {
        return {
            img: require('@/assets/404_images/404.png'),
        }
    }
}
</script>

<style scoped lang="less">
.space {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    img {
        width: 100%;
    }
    p {
        color: #aaa;
        margin-top: .1rem;
    }
}
</style>