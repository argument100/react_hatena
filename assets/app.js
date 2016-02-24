import React from "react";
import ReactDOM from "react-dom";

let List__item = React.createClass({
  propsTypes: {
    data: React.PropTypes.array.isRequired,
    inputTxt: React.PropTypes.string.isRequired,
    onSearchText: React.PropTypes.func.isRequired
  },
  render: function(){
    if(Object.keys(this.props.data).length === 0) return <div></div>

    let inputTxt = this.props.inputTxt;
    let itemList = this.props.data.map(function(item, i){
      let imgSrc = (item.content.match(/<img src="(?=http:\/\/cdn-ak\.b)(.+?)"[^>]+?>/) || [])[1];

      if(inputTxt !== "" && !new RegExp(inputTxt, "i").test(item.title)) {
        return false;
      }
      return(
        <a href={item.link} key={i} target="_blank">
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
  propTypes: {
    data: React.PropTypes.array
  },
  getDefaultProps: function(){
    return {
      data: []
    };
  },
  getInitialState: function() {
    return {
      searchFilter: ""
    };
  },
  componentWillMount: function(){
    let promise = Promise.resolve($.ajax({
      type: "GET",
      url: "https://ajax.googleapis.com/ajax/services/feed/load?v=1.0&q=http://b.hatena.ne.jp/entrylist/it.rss&num=30",
      dataType: "jsonp"
    }));

    promise.then((resolve) => {
      // react0.14からはsetPropsは非推奨、ReactDOMでレンダリングし直すのが良い
      ReactDOM.render(
        <List data={resolve.responseData.feed.entries} />,
        document.getElementById('content')
      );
    });
  },
  render: function(){
    return(
      <div>
        <List__item data={this.props.data} inputTxt={this.state.searchFilter} onSearchText={this.searchText} />
      </div>
    );
  },
  // インクリメンタル検索用Filter文字設定関数
  searchText: function(e){
    this.setState({
      searchFilter: e.target.value
    });
  }
});

ReactDOM.render(
  <List />,
  document.getElementById('content')
);
