<template>
  <div class="book-list">
    <div class="book-content-head">小书章节</div>
    <span @click="writeChapter('add')">新增小书章节</span>
    <div class="book-directory section-of-info">
      <div class="section"
           v-for="x in 10 ">
        <div class="step">
          <div class="step-btn">{{x}}</div>
        </div>
        <div class="center">
          <div class="title"
               @click="openChapter">开篇词 —— 小册食用指南</div>
          <div class="sub-line">
            <div class="statistics">
              <span class="duration">时长: 3分30秒</span>
              <span class="readed">1637次学习</span><span class="comment">7条评论</span>
              <span @click="writeChapter('update')">编辑</span>
              <span>删除</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BookList",
  data () {
    return {

    };
  },
  methods: {
    openChapter () {
      this.$router.push({ name: 'BookView', params: { books_id: 555, book_id: 666 } })
    },
    writeChapter (type) {
      this.$router.push({ name: 'WriteBookView', params: { books_id: 555, book_id: 666 }, query: { type: type } })
    },
  },
  components: {

  }
};
</script>

<style scoped lang="scss">
.book-list {
  padding: 30px 30px 0;
  .book-content-head {
    position: relative;
    font-weight: 700;
    margin-bottom: 20px;
    color: #333;
    line-height: 1.5;
    padding-bottom: 12px;
    font-size: 20px;
    border-bottom: 1px solid #ececec;
  }
  .section-of-info {
    color: #000;
    .section {
      position: relative;
      min-height: 75px;
      cursor: default;
      padding-left: 20px;
      padding-right: 35px;
      border-radius: 2px;
      font-size: 14px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      color: #8f9193;
    }
    .section {
      position: relative;
      min-height: 70px;
      .step {
        align-items: center;
        display: flex;
        margin-right: 15px;
        align-self: stretch;
        position: relative;
        .step-btn {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          font-size: 16px;
          border-radius: 50%;
          border: 2px solid #b5b7ba;
          color: #b5b7ba;
          box-sizing: border-box;
          text-align: center;
          background-color: #fff;
          z-index: 1;
        }
        .step-btn {
          width: 45px;
          height: 45px;
          border-width: 3px;
          font-size: 18px;
        }
        &:after,
        &:before {
          z-index: 0;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 2px;
          background-color: #b5b7ba;
          height: 50%;
          content: "";
        }
        &:after {
          top: 50%;
        }
        &:before {
          top: 0;
        }
      }
      &:first-child {
        .step {
          &:before {
            top: 0;
            content: "";
            display: none;
          }
        }
      }
      &:last-child {
        .step {
          &:after {
            top: 0;
            content: "";
            display: none;
          }
        }
      }
      .center {
        flex-grow: 1;
        padding-top: 12px;
        padding-bottom: 12px;
        margin-left: auto;
        margin-right: auto;
        .title {
          color: #000;
          font-size: 16px;
        }
        .sub-line {
          display: flex;
          align-items: center;
          margin-top: 3px;
          .statistics {
            color: #b2bac2;
            font-size: 12px;
            display: flex;
            flex-wrap: wrap;
            span {
              margin-right: 12px;
            }
          }
        }
      }
    }
  }
}
</style>
