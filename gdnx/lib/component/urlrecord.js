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
                        <th width="48%">URL</th>
                        <th>IP地址</th>
                        <th>上网时间</th>
                    </tr>
               </thead>
                {
                    this.props.datalist.map((list, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    <td>{list.weburl}</td>
                                    <td>{list.userip}</td>
                                    <td>{list.occurtime}</td>
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
            user: document.getElementById('user').value,
            mobile: document.getElementById('mobile').value,
            ip: document.getElementById('ip').value
        };
    };
    componentDidMount(){
        var self = this;
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            location: this.state.location,
            user: this.state.user,
            mobile: this.state.mobile,
            ip: this.state.ip
        };
        console.log(param);
        urlRecordFunc("get", param, function(data){
            if(data.code==200){
                this.setState({list: data.web_history, pagecount:data.page_count, btnStatus: false});
            }
        }.bind(this));
    };
    ajaxHandle() {
        addLoad('正在加载中...');
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            location: this.state.location,
            user: this.state.user,
            mobile: this.state.mobile,
            ip: this.state.ip
        };
        console.log(param);
        urlRecordFunc("get", param, function(data){
            if(data.code==200){
                this.setState({list: data.web_history, pagecount:data.page_count, btnStatus: false});
                removeLoad();
            }
        }.bind(this));
    };
    onPage(page) {
        $('body,html').scrollTop($('#urlRecordMemTable').parent().offset().top);
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
    document.querySelector('#urlRecordMemTable')
);