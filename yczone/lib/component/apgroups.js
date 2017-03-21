import React, {Component} from "react";
import ReactDOM from "react-dom";
import {Page} from "./component";


// React Component
class Table extends Component {
    // 删除
    handleDel(e){
        if(confirm('确定要删除吗？')){
            var delIndex = e.target.getAttribute('data-key');
            var mac = e.target.parentNode.getElementsByClassName('mac')[0].value;
            this.props.onDel(delIndex, mac);
        }
    };
    render() {
        return (
            <table className="tbodyClass">
               <thead>
                    <tr>
                        <th>MAC地址</th>
                        <th>所属</th>
                        <th>状态</th>
                        <th>品牌</th>
                        <th>位置</th>
                        <th>操作</th>
                    </tr>
               </thead>
                {
                    this.props.datalist.map((list, index) => {
                        return (
                            <tbody key={index}>
                                <tr>
                                    <td>{list.mac}</td>
                                    <td>{list.resource_name}</td>
                                    <td>{ list.online==1 ? <span style={{color:"#27b600"}}>在线</span> : <span style={{color:"#f74646"}}>离线</span> }</td>
                                    <td>{ list.vendor!="" ? <i className={ "vendor "+list.vendor }></i>: null }</td>
                                    <td>{list.address}</td>
                                    <td>
                                        <span className="delete" onClick={this.handleDel.bind(this)} data-key={index}>删除</span>
                                        <input type="hidden" className="mac" value={list.mac} />
                                    </td>
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
            groupId: document.querySelector('#apgroupChange').getElementsByTagName('li')[0].getAttribute("data-id")
        };
    };
    componentDidMount(){
        var self = this;
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword,
            ap_group_id: this.state.groupId
        };
        console.log(param);
        apgrouplistAjax("get", param, function(data){
            if(data.code==200){
                this.setState({list: data.aps, pagecount:data.page_count, btnStatus: false});
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
        // 切换AP组
        var apgroupLi = document.querySelector('#apgroupChange');
        for(var i=0; i<apgroupLi.getElementsByTagName('li').length; i++){
            apgroupLi.getElementsByTagName('li')[i].addEventListener('click', function(){
                $(this).addClass('act').siblings().removeClass('act');
                console.log(this.getAttribute("data-id"));
                $('#search input').val('');
                self.setState({page: 1, groupId: this.getAttribute("data-id"), keyword: ''}, function(){
                    var id = $('#apgroupChange .act').data('id'), location=$('#location').val();
                    $('#apgroups .editbtn').attr("href", '/apgroupsedit.html?location='+location+'&ap_group_id='+id);
                    self.ajaxHandle();
                });
            });
        }
    };
    ajaxHandle() {
        addLoad('正在加载中...');
        var param = {
            page_size: this.state.page_size,
            page: this.state.page,
            keyword: this.state.keyword,
            ap_group_id: this.state.groupId
        };
        console.log(param);
        apgrouplistAjax("get", param, function(data){
            if(data.code==200){
                this.setState({list: data.aps, pagecount:data.page_count, btnStatus: false});
                removeLoad();
            }
        }.bind(this));
    };
    onPage(page) {
        $('body,html').scrollTop($('#apgroupsMemTable').parent().offset().top);
        this.setState({page: page, btnStatus: true}, function(){
            this.ajaxHandle();
        });
    };
    onDelete(index, mac) {
        this.state.list.splice(index, 1);
        var rows = this.state.list;
        apgrouplistAjax("delete", {ap_group_id: this.state.groupId, mac: mac}, function(data){
            if(data.code==200){
                this.setState({list: rows});
            }else{
                alert("删除失败");
            }
        }.bind(this));
    };
    render() {
        return (
            <div className="areabox">
                <Table datalist={this.state.list} onDel={this.onDelete.bind(this)} />
                <Page page={this.state.page} pagecount={this.state.pagecount} callbackPage={this.onPage.bind(this)} btnDis={this.state.btnStatus} />
            </div>
        )
    }
}

ReactDOM.render(
    <Box />,
    document.querySelector('#apgroupsMemTable')
);