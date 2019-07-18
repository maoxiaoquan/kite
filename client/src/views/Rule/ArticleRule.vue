<template>
  <section class="layout-content box-container container" id="article-rule-lay">
    <div class="row">
      <main class="lay-main col-xs-12 col-sm-12 col-md-12">
        <div class="comment-rule">
          <p>本平台是一个致力于帮助每个人更好地运用数字产品或科学方法让生活工作变得更好的内容平台。</p>
          <h3>违规内容界定</h3>
          <h3>1.违反法律法规，发布违反国家相关法律法规及「九不准」管理规定的信息，如</h3>
          <ul>
            <li>反对宪法所确定的基本原则危害国家安全；</li>
            <li>泄露国家秘密，颠覆国家政权，破坏国家统一；</li>
            <li>损害国家荣誉和利益；</li>
            <li>煽动民族仇恨、民族歧视，破坏民族团结；</li>
            <li>侮辱、滥用英烈形象，否定英烈事迹，美化粉饰侵略战争行为的；</li>
            <li>破坏国家宗教政策，宣扬邪教和封建迷信；</li>
            <li>散布谣言，扰乱社会秩序，破坏社会稳定；</li>
            <li>宣扬淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪；</li>
            <li>煽动非法集会、结社、游行、示威、聚众扰乱社会秩序；</li>
            <li>诽谤他人，泄露他人隐私，侵害他人合法权益；</li>
            <li>含有法律、行政法规禁止的其他内容的信息。</li>
          </ul>
          <h3>2.&nbsp;发布广告垃圾信息，如</h3>
          <ul>
            <li>文章中包含售卖产品、提供服务、宣传推广内容的；</li>
            <li>
              文章中包含未明确标明
              <sup>
                1
                <div class="sup-tips" style="display: none;">
                  未明确标明指文章中没有明确的文字说明
                  <div class="pointer"></div>
                </div>
              </sup>&nbsp;的返利链接、推广链接、邀请红包等内容；
            </li>
            <li>使用特殊符号、图片等方式规避广告内容审核的广告内容。</li>
          </ul>
          <h3>3.&nbsp;恶意行为，如：</h3>
          <ul>
            <li>重复发布干扰正常用户体验的内容；</li>
            <li>发布盗版相关内容；</li>
            <li>冒充他人，通过头像、用户名等个人信息暗示自己与他人或机构相等同或有关联；</li>
            <li>发布含有潜在危险的内容，或使用第三方网站伪造跳转链接，如钓鱼网站、木马、病毒网站等；</li>
            <li>恶意对抗行为，包括但不限于使用变体、谐音等方式规避安全审查，明知相关行为违反法律法规和社区规范仍然发布等；</li>
          </ul>
          <h2>违规处理方式</h2>
          <ul>
            <li>对于文章涉及「违反法律法规」的，本平台将删除相关文章、并永久封停发布相关文章的用户账号，终止用户继续使用本平台；</li>
            <li>对于文章涉及「不友善行为」、「发布广告垃圾信息」、「恶意行为」的，本平台将视严重程度采取以下措施：</li>
            <ul>
              <li>对发布相关文章的用户进行不低于&nbsp;3&nbsp;天的文章禁言处理；</li>
              <li>警告发布相关文章的用户，并建议立即按要求删改文章；</li>
              <li>管理员直接修改或删除相关文章；</li>
              <li>
                永久封停账号，终止发布相关文章的用户继续使用本平台。
                <br />
              </li>
            </ul>
            <li>对于屡次违规的用户，本平台将终止用户继续使用本平台。</li>
          </ul>
          <p>用户如发现文章存在上述违规行为，可联系网站管理员进行反馈。</p>
          <p>为维护本平台良好的氛围，我们会根据平台实际运营情况持续完善这个规范。</p>
          <p>本规范自 2019&nbsp;年 7&nbsp;月 12 日起正式生效。</p>
          <p>
            <br />
          </p>
        </div>
      </main>
    </div>
  </section>
</template>

<script>
export default {
  metaInfo() {
    return {
      title: "文章编写规范",
      meta: [
        {
          // set meta
          name: "description",
          content: '文章编写规范'
        }
      ],
      htmlAttrs: {
        lang: "zh"
      }
    };
  }
};
</script>

<style scoped lang="scss">
#article-rule-lay {
  p {
    margin-bottom: 15px;
  }
  h3,
  h2 {
    margin-top: 20px;
  }
  ul {
    background: #f3f3f3;
    padding: 20px;
    margin-top: 10px;
    li {
      line-height: 25px;
    }
  }
}
</style>