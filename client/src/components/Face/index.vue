<template>
  <div class="face">
    <div class="face-switch">
      <span class="face-switch-item"
            v-for="(item,key) in faceSwitchList"
            :class="{'active':item.key===currfaceSwitch}"
            :key="key"
            @click="currfaceSwitch=item.key">{{item.title}}</span>
    </div>
    <div class="face-view">
      <ul class="face-view-item clearfix">
        <li class="qq-item"
            v-for="(item,key) in faceqq"
            @click="changeFace(item)"
            :key="key">
          <img v-lazy="item.face_url"
               :alt="item.face_text">
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import faceqq from './face/qq'

export default {
  name: 'Face',
  data () {
    return {
      faceSwitchList: [
        {
          title: '默认',
          key: 'qq'
        }
      ],
      currfaceSwitch: 'qq',
      faceqq: faceqq
    }
  },
  methods: {
    changeFace (val) {
      this.$emit('changeFace', val)
    }
  }
}
</script>

<style scoped lang="scss">
.face {
  width: 500px;
  .face-switch {
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 5px;
    margin-bottom: 10px;
    .face-switch-item {
      display: inline-block;
      padding: 5px 12px;
      font-size: 14px;
      &.active {
        color: #f56c6c;
      }
    }
  }
  .face-view {
    .face-view-item {
      .qq-item {
        width: 28px;
        height: 28px;
        float: left;
        display: flex;
        text-align: center;
        align-items: center;
        cursor: pointer;
        img {
          display: inline-block;
        }
      }
    }
  }
}
</style>
