import React, {Component} from "react";
import ReactDOM from "react-dom";

// 翻页组件
class Page extends Component {
    pageNext() {
        var page = parseInt(ReactDOM.findDOMNode(this.refs.nowpage).innerText);
        page++;
        if(page<=this.props.pagecount){
            ReactDOM.findDOMNode(this.refs.nowpage).innerText=page;
            this.props.callbackPage(page);
        }
    };
    pagePrev() {
        var page = parseInt(ReactDOM.findDOMNode(this.refs.nowpage).innerText);
        page--;
        if(page>0){
            ReactDOM.findDOMNode(this.refs.nowpage).innerText=page;
            this.props.callbackPage(page);
        }
    };
    pageJump() {
        var page = parseInt(ReactDOM.findDOMNode(this.refs.jumpIpu).value);
        if(page>0 && page<=this.props.pagecount){
            ReactDOM.findDOMNode(this.refs.nowpage).innerText=page;
            this.props.callbackPage(page);
        }else{
            console.log("超出查找页数");
        }
    };
    render() {
        return (
            <div className="page">
                <input type="button" value="跳转" className="btnWhiteSmall jump" onClick={this.pageJump.bind(this)} disabled={this.props.btnDis} />
                <input type="text" className="pagesize" placeholder="1" ref="jumpIpu" />
                <input type="button" value="下一页" className="btnWhiteSmall next" onClick={this.pageNext.bind(this)} disabled={this.props.btnDis} />
                <div><span className="nowpage" ref="nowpage">{this.props.page}</span>/<span className="pagecount">{this.props.pagecount}</span></div>
                <input type="button" value="上一页" className="btnWhiteSmall prev" onClick={this.pagePrev.bind(this)} disabled={this.props.btnDis} />
            </div>
        )
    }
}

// 排序组件
class SortCmp extends Component {
    constructor(){
        super();
        this.state={
            currentIndex : 100,     // 初始值：设置大于表单列数
            xb: true,
            flag: true
        };
    };
    check_index(index, sortIndex, xbcheck){
        var sortClass = '', cidx, xbc;
        if(this.state.flag){
            cidx = sortIndex;
            xbc = xbcheck;
        }else{
            cidx = this.state.currentIndex;
            xbc = this.state.xb;
        }
        if(index===cidx){
            sortClass = (xbc ? "sortOn sortDown" : "sortOn sortUp");
        }else{
            sortClass = "sortOn";
        }
        return sortClass;
    };
    sortList(index, name, sortIndex, xbcheck){
        var sort={};
        var self=this;
        if(this.state.flag){
            if(index===sortIndex){
                this.setState({currentIndex : index, xb: !xbcheck, flag: false}, function(){
                    sort[name]=(this.state.xb?1:-1);
                    console.log(sort);
                    this.props.callbackSort(JSON.stringify(sort), self.state.currentIndex, self.state.xb);
                });
            }else{
                this.setState({currentIndex : index, xb: true, flag: false}, function(){
                    sort[name]=(this.state.xb?1:-1);
                    console.log(sort);
                    this.props.callbackSort(JSON.stringify(sort), self.state.currentIndex, self.state.xb);
                });
            }
        }else{
            if(index===this.state.currentIndex){
                this.setState({currentIndex : index, xb: !this.state.xb, flag: false}, function(){
                    sort[name]=(this.state.xb?1:-1);
                    console.log(sort);
                    this.props.callbackSort(JSON.stringify(sort), self.state.currentIndex, self.state.xb);
                });
            }else{
                this.setState({currentIndex : index, xb: true, flag: false}, function(){
                    sort[name]=(this.state.xb?1:-1);
                    console.log(sort);
                    this.props.callbackSort(JSON.stringify(sort), self.state.currentIndex, self.state.xb);
                });
            }
        }
    };
    render() {
        return (
            /*动态生成th*/
            <tr>
                {
                    React.Children.map( this.props.children , (element,index) => {
                        if(element==''){console.log('这里有空th');}
                        if(element==null){console.log('这里有null th');}
                        if(!(element==null)){
                            if(element.type=='span'){
                                return(
                                    /*箭头函数没有自己的this，这里的this继承自外围作用域，即组件本身*/
                                    <th onClick={ () => {this.sortList(index, element.props.name, this.props.sortIndex, this.props.xbcheck)}} className={this.check_index(index, this.props.sortIndex, this.props.xbcheck)}>{element}</th>
                                )
                            }else{
                                return (
                                    <th>{element}</th>
                                )
                            }
                        }
                    })
                }
            </tr>
        )
    }
}

export {Page, SortCmp};