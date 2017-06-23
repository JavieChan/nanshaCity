import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Page} from "./component";


// React Component
class Table extends Component {
    render() {
        return (
            <table className="tbodyClass">
               <thead>
                    <tr>
                        <th width="">手机号</th>
                        <th width="">类型</th>
                        <th width="">金额(元)</th>
                        <th width="">时间</th>
                        <th width="">备注</th>
                    </tr>
               </thead>
                {
                    this.props.datalist.map((list, index) => {
                        var pfc='';
                        if(list.platform=='wxpay'){
                            pfc="微信";
                        }else if(list.platform=='alipay'){
                            pfc="支付宝";
                        }else if(list.platform=='apple'){
                            pfc="苹果内购";
                        }
                        return (
                            <tbody key={index}>
                                <tr>
                                    <td>{list.mobile}</td>
                                    <td>{pfc}</td>
                                    <td>{list.fee}</td>
                                    <td>{list.ctime}</td>
                                    <td>{list.note}</td>
                                </tr>
                            </tbody>
                        )
                    })
                }
            </table>
        )
    }
}

// 整体
class Box extends Component {
    constructor(props){
        super(props);
        this.state = {
            list: [],
            page_size: 50,   // 每页显示数量
            page: 1,        // 当前页数
            keyword: '',    // 搜索关键字
            pagecount: 1,  // 最大页数
            btnStatus: false,  // button状态
            location: document.getElementById('location').value,
            mobile: $('#userinfo span[name=mobile]').data('value')
        };
    };
    componentDidMount(){
        var self = this;
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword,
            location: this.state.location
        };
        console.log(param);
        payrecordFunc("get", this.state.mobile, param, function(data){
            if(data.code==200){
                this.setState({list: data.records, pagecount:data.page_count, btnStatus: false});
            }
        }.bind(this));
        // 搜索监听
        var searchBtn = document.querySelector('#search');
        searchBtn.firstChild.addEventListener('change', function(){
            console.log(this.value);
            self.setState({keyword: this.value});
        });
        searchBtn.lastChild.addEventListener('click', function(){
            self.setState({page: 1}, function(){
                self.ajaxHandle();
            });
        });
    };
    ajaxHandle() {
        addLoad('正在加载中...');
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword,
            location: this.state.location
        };
        console.log(param);
        payrecordFunc("get", this.state.mobile, param, function(data){
            if(data.code==200){
                this.setState({list: data.records, pagecount:data.page_count, btnStatus: false});
                removeLoad();
            }
        }.bind(this));
    };
    onPage(page) {
        $('body,html').scrollTop($('#payrecordMemTable').parent().offset().top);
        this.setState({page: page, btnStatus: true}, function(){
            this.ajaxHandle();
        });
    };
    render() {
        return (
            <div className="areabox">
                <Table datalist={this.state.list} />
                <Page page={this.state.page} pagecount={this.state.pagecount} callbackPage={this.onPage.bind(this)} btnDis={this.state.btnStatus} />
            </div>
        )
    }
}

ReactDOM.render(
    <Box />,
    document.querySelector('#payrecordMemTable')
);