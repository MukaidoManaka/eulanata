<template>
  <div>
      <div v-for="(item,index) in inputlist" :key="index">
          <van-field v-model="item.value" label="实发" required input-align="right" type="number" placeholder="请输入(非必填)" @blur="mycheck(index)" >
              <div slot="extra">敲</div>
          </van-field>
          <div class="errortip">发货那么多干嘛，敲里吗</div>
      </div>
      
  </div>
</template>

<script>
export default {
    name: 'aaa',
    data() {
        return {
            inputlist: [
                {
                    value: 0,
                    maxnum :10,
                    flag: false,
                },
                {
                    value: 0,
                    maxnum :11,
                    flag: false,
                },
                {
                    value: 0,
                    maxnum :12,
                    flag: false,
                },
            ]
        }
    },
    methods: {
        mycheck(index){
            var data = this.inputlist[index];
            console.log(com)
            if(data.value > data.maxnum){
                data.flag = true;
            }
            else{
                data.flag = false;
            }
        }
    }
}
</script>

<style>
.errortip{
    color: #ee0a24;
}
</style>