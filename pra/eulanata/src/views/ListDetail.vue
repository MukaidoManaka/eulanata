<template>
  <div class="deliveryDetail">
    <div class="header">
       <van-nav-bar title="送货单详情" left-text="返回" left-arrow @click-left="returnPrev"></van-nav-bar>
    </div>
    <div class="section">
      <van-cell-group>
        <van-cell title="单元格" value="内容" />
        <van-cell title="单元格" value="内容" label="描述信息" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="单元格" value="内容" />
        <van-cell title="单元格" value="内容" label="描述信息" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="单元格" value="内容" />
        <van-cell title="单元格" value="内容" label="描述信息" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="单元格" value="内容" />
        <van-cell title="单元格" value="内容" label="描述信息" />
      </van-cell-group>
      <van-cell-group>
        <van-cell title="单元格" value="内容" />
        <van-cell title="单元格" value="内容" label="描述信息" />
      </van-cell-group>
    </div>
    <div class="footer">
      
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListDetail',
  data() {
    return {

    }
  },
  methods: {
    returnPrev() {
      this.$router.push('/home')
    }
  },
  created() {
    console.log('外面传进来的id',this.$route.params.id)
  }
}
</script>

<style scoped lang="less">
  .deliveryDetail {
    display: flex;
    flex-direction: column;
    height: 100%;
    font-size: .14rem;
  }
  .section {
    flex: 1;
  }
</style>