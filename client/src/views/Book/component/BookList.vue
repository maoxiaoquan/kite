<template>
  <div class="book-list">
    <router-link class="btn create-book"
                 v-if="personalInfo.islogin&&personalInfo.user.uid===books.booksInfo.user.uid"
                 :to="{name:'WriteBookView',params: { books_id: $route.params.books_id, book_id: 'create' }}">新增小书章节</router-link>
    <div class="book-content-head">小书章节</div>
    <div class="book-directory section-of-info"
         v-if="books.booksBookAll.length">
      <div class="section"
           v-for="(bookItem,key) in books.booksBookAll"
           :key="key">
        <div class="step">
          <div class="step-btn">{{key+1}}</div>
        </div>
        <div class="center">
          <div class="title"
               @click="lookChapter(bookItem)">{{bookItem.title}}</div>
          <div class="sub-line">
            <div class="statistics">
              <span class="duration">时长: {{bookItem.rTime}}</span>
              <span class="readed">{{bookItem.read_count||0}}次学习</span><span class="comment">{{bookItem.commentCount||0}}条评论</span>
              <span class="read"
                    v-if="Number(books.booksInfo.is_free)===isFree.pay&&Number(bookItem.trial_read)===trialRead.yes">可试读</span>
              <span class="edit"
                    @click="writeChapter(bookItem.book_id)"
                    v-if="personalInfo.islogin&&personalInfo.user.uid===bookItem.uid">编辑章节</span>
              <span class="delete"
                    @click="deleteChapter(bookItem.book_id)"
                    v-if="personalInfo.islogin&&personalInfo.user.uid===bookItem.uid">删除</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else
         class="book-directory-null">
      当前小书章节为空，请等待作者新增章节......
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {
  trialRead,
  trialReadText,
  isFree
} from '@utils/constant'

export default {
  name: "BookList",
  data () {
    return {
      trialRead,
      trialReadText,
      isFree
    }
  },
  methods: {
    lookChapter (bookItem) {
      if (bookItem.isBuy || bookItem.trial_read === this.trialRead.yes || bookItem.uid === this.personalInfo.user.uid || Number(this.books.booksInfo.is_free) === this.isFree.free) {
        this.$router.push({ name: 'BookView', params: { books_id: this.$route.params.books_id, book_id: bookItem.book_id } })
      } else {
        this.$message.warning('当前章节需要购买后可阅读');
      }
    },
    writeChapter (book_id) {
      if (!this.personalInfo.islogin) {
        this.$message.warning('编辑小书需要登录');
        return false
      }
      this.$router.push({ name: 'WriteBookView', params: { books_id: this.$route.params.books_id, book_id: book_id } })
    },
    deleteChapter (book_id) {
      this.$confirm('此操作将永久删除该小书章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('book/DELETE_BOOK', {
          book_id
        })
          .then(result => {
            if (result.state === 'success') {
              this.$message.success(result.message);
              this.$store.dispatch("books/GET_BOOKS_BOOK_ALL", { books_id: this.$route.params.books_id })
            } else {
              this.$message.warning(result.message);
            }
          })
      }).catch(() => {
      });
    }
  },
  computed: {
    ...mapState(['books', 'personalInfo'])
  },
  components: {

  }
};
</script>

<style scoped lang="scss">
.book-list {
  padding: 30px 30px 60px;
  .create-book {
    padding: 5px 13px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.88);
    background: #ffd600;
    border-color: #ffd600;
    margin-bottom: 10px;
  }
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
          cursor: pointer;
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
              display: inline-block;
              vertical-align: middle;
            }
            .read {
              color: #fff;
              background: lightcoral;
              font-size: 12px;
              border-radius: 3px;
              line-height: 18px;
              padding: 1px 3px;
              cursor: pointer;
            }
            .edit {
              color: #fff;
              background: #ffd600;
              font-size: 12px;
              border-radius: 3px;
              line-height: 18px;
              padding: 1px 3px;
              cursor: pointer;
            }
            .delete {
              background: #db5000;
              color: #fff;
              font-size: 12px;
              border-radius: 3px;
              line-height: 18px;
              padding: 1px 3px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .book-directory-null {
    font-size: 14px;
    padding: 20px 0;
    color: #666;
    text-align: center;
  }
}
</style>
