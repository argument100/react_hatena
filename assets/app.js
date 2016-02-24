import React from "react";
import ReactDOM from "react-dom";
// React.js v0.14から[addons]は個別パッケージに分割されたので機能ごとにnpmインストールが必要
import ReactUpdate from "react-addons-update";


let List__item = React.createClass({
  render: function(){
    if(Object.keys(this.props.data.entries).length === 0) return <div></div>

    let sFilter = this.props.data.searchFilter;
    let itemList = this.props.data.entries.map(function(item){
      let imgSrc = (item.content.match(/<img src="(?=http:\/\/cdn-ak\.b)(.+?)"[^>]+?>/) || [])[1];

      if(sFilter !== "" && !new RegExp(sFilter, "i").test(item.title)) {
        return false;
      }
      return(
        <a href={item.link} target="_blank">
          <div className="media">
            <div className="media-left">
              <img className="media-object" src={imgSrc} alt="" />
            </div>
            <div className="media-body">
              <h4 className="media-heading">{item.title}</h4>
              {item.contentSnippet}
            </div>
          </div>
        </a>
      );
    });
    return(
      <div className="mediaBox">
        <input type="text" onInput={this._onSearchText} />
        {itemList}
      </div>
    );
  },
  // 子要素で起きたイベントを親要素の関数へ
  _onSearchText: function(e){
    this.props.onSearchText(e);
  }
});


// 親コンポーネント
let List = React.createClass({
  getInitialState: function() {
    return {
      data: {
        entries: [],
        searchFilter: ""
      }
    };
  },
  componentWillMount: function(){
    let promise = Promise.resolve($.ajax({
      type: "GET",
      url: "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://b.hatena.ne.jp/entrylist/it.rss&num=30",
      dataType: "jsonp"
    }));

    promise.then((resolve) => {
      this.setState({
        data:{
          entries: resolve.responseData.feed.entries
        }
      });
    });
  },
  render: function(){
    return(
      <div>
        <List__item data={this.state.data} onSearchText={this.searchText} />
      </div>
    );
  },
  // インクリメンタル検索用Filter文字設定関数
  searchText: function(e){
    let newState = ReactUpdate(this.state, {
      data:{
        searchFilter: {$set: e.target.value}
      }
    });
    this.setState(newState);
  }
});

ReactDOM.render(
  <List />,
  document.getElementById('content')
);
