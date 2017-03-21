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
                        <th>账号</th>
                        <th>用户MAC</th>
                        <th>位置</th>
                        <th>漫游开始时间</th>
                        <th>漫游结束时间</th>
                    </tr>
               </thead>
                {
                    this.props.datalist.map((list, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    <td>{list.user}</td>
                                    <td>{list.mac}</td>
                                    <td>{list.address}</td>
                                    <td>{list.acct_start_time}</td>
                                    <td>{list.acct_stop_time}</td>
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
            start: document.querySelector('#dateStart').value,   // 开始时间
            end: document.querySelector('#dateEnd').value,   // 结束时间
            mobile: $('#userinfo span[name=mobile]').data('value'),
            user: ( ($('#userinfo span[name=user]').length>0) ? $('#userinfo span[name=user]').data('value') : ( ( $('#userinfo span[name=account]').length>0) ? $('#userinfo span[name=account]').data('value') : '') ),
            mac: ( $('#macHid').val() ? $('#macHid').val() : '' ),
            ip: ( ($('#macIP').length>0) ? $('#macIP').val() : '' )
        };
    };
    componentDidMount(){
        var self = this;
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword,
            location: this.state.location,
            start: this.state.start,
            end: this.state.end,
            mobile: this.state.mobile,
            user: this.state.user,
            mac: this.state.mac,
            ip: this.state.ip
        };
        console.log(param);
        onlineRecordFunc("get", param, function(data){
            if(data.code==200){
                this.setState({list: data.records, pagecount:data.page_count, btnStatus: false});
            }
        }.bind(this));
        // 开始结束时间
        $("#dateStart").datetimepicker({
            dateFormat: 'yy-mm-dd',
            stepMinute: 10,
            onClose: function(selectedDate) {
                $("#dateEnd").datepicker("option", "minDate", selectedDate);
                self.setState({start: selectedDate});
                console.log(selectedDate);
            }
        });
        $("#dateEnd").datetimepicker({
            dateFormat: 'yy-mm-dd',
            stepMinute: 10,
            onClose: function(selectedDate) {
                $("#dateStart").datepicker("option", "maxDate", selectedDate);
                self.setState({end: selectedDate});
                console.log(selectedDate);
            }
        });
        var dateSearch = document.querySelector('#dateSearch');
        dateSearch.addEventListener('click', function(){
            self.ajaxHandle();
        });
    };
    ajaxHandle() {
        addLoad('正在加载中...');
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword,
            location: this.state.location,
            start: this.state.start,
            end: this.state.end,
            mobile: this.state.mobile,
            user: this.state.user,
            mac: this.state.mac,
            ip: this.state.ip
        };
        console.log(param);
        onlineRecordFunc("get", param, function(data){
            if(data.code==200){
                this.setState({list: data.records, pagecount:data.page_count, btnStatus: false});
                removeLoad();
            }
        }.bind(this));
    };
    onPage(page) {
        $('body,html').scrollTop($('#onlineRecordMemTable').parent().offset().top);
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
    document.querySelector('#onlineRecordMemTable')
);