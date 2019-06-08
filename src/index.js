import React from 'react';
import ReactDOM from 'react-dom';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

class Table extends React.Component {
	render(){
	};
};

class App extends React.Component {
	constructor(props){
		super(props);
		
		this.state = {
			response: '',
			request: null,
			params: {
				pp: null,
				dwp: null,
				ir: null,
				y: null,
				pptx: null,
				am: null,
				hoa: null,
				ai: null,
				aa: null,
				mitr: null,
				gi: null,
				rsh: null,
				ri: null,
				aafroc: null,
				wsy: null,
				hscr: null
			}
		};
		
		this.reload = this.reload.bind(this);
	};
	
	buildRow(data, title){
		var out = [];
		
		for (var key in data)
		{
			if (!out.length && title) out.push(<div className="cell" key={title}>{title}</div>);
			
			out.push(<div className="cell" key={key}>{data[key]}</div>);
		}
		
		return out;
	};
	
	buildTable(data){
		var	out = [];
		
		for (var key in data)
		{
			if (key !== 'index') out.push(<div className="row" key={key}>{this.buildRow(data[key], key)}</div>);
		}
		
		return out;
	};
	
	buildTableHeader(data){
		var out = [];
		
		out.push(<div className="cell" key="empty"></div>);
		for (var key in data)
		{
			out.push(<div className="cell" key={key}>{key}</div>);
		}
		
		return out;
	};
	
	qs(data){
		let p = [];
		
		for (var key in data)
		{
			if (data[key]) p.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		}
		
		return '?' + p.join('&');
	};
	
	reload(e){
		let 
			temp = this.state.params,
			target = e.target,
			xhr = null;
		
		temp[target.getAttribute('name')] = target.value;
		
		if (this.state.request) this.state.request.abort();
		
		fetch('https://api.xstyle.life/rentbuy' + this.qs(temp))
			.then(res => res.json())
			.then(
				(r) => {
					this.setState({
						response: 
							<div className="holder">
								<div className="table">
									<div className="header">
										<div className="row" key="header-row">{this.buildTableHeader(r.t_m0.index)}</div>
									</div>
									<div className="content">{this.buildTable(r.t_m0)}</div>
								</div>
								<div className="table table2">
									<div className="header">
										<div className="row" key="header-row">{this.buildTableHeader(r.t_m1.index)}</div>
									</div>
									<div className="content">{this.buildTable(r.t_m1)}</div>
								</div>
								<div className="table table3">
									<div className="header">
										<div className="row" key="header-row">
											<div className="cell" key="0">Home value after {temp.y} years</div>
											<div className="cell" key="1">Debt after {temp.y} years</div>
											<div className="cell" key="2">Home equity after {temp.y} years</div>
											<div className="cell" key="3">Transaction cost of selling</div>
											<div className="cell" key="4">Net cash gain</div>
											<div className="cell" key="5">Savings after {temp.y} years if renting</div>
											<div className="cell" key="6">Present value benefit</div>
										</div>
									</div>
									<div className="content">
										<div className="row" key="header-row">
											{this.buildRow(r.t_d)}
										</div>
									</div>
								</div>
							</div>,
						request: null,
						params: temp
					});
				},
				(error) => {
					console.log('[001] unable to access API');
					console.log(error);
					this.setState({
						response: '',
						request: null,
						params: temp
					});
				}
			);
		
		this.setState({
			response: <div className="spinner-holder"><div className="spinner"></div></div>,
			request: xhr,
			params: temp
		});
	};
	
	renderResults(){
		return this.state.response;
	};
	
	render(){
		return (
			<div className="App">
				<div className="InputSection">
					<Input placeholder="Purchase price" name="pp" onChange={this.reload} />
					<Input placeholder="Down Payment" name="dwp" onChange={this.reload} />
					<Input placeholder="Interest rate" name="ir" onChange={this.reload} />
					<Input placeholder="Years" name="y" onChange={this.reload} />
					<Input placeholder="Property Tax Rate" name="pptx" onChange={this.reload} />
					<Input placeholder="Annual Maintenance" name="am" onChange={this.reload} />
					<Input placeholder="HOA" name="hoa" onChange={this.reload} />
					<Input placeholder="Annual Insurance" name="ai" onChange={this.reload} />
					<Input placeholder="Annual Appreciation" name="aa" onChange={this.reload} />
					<Input placeholder="Marginal Income Tax Rate" name="mitr" onChange={this.reload} />
					<Input placeholder="General Inflation" name="gi" onChange={this.reload} />
					<Input placeholder="Renting Similar Home" name="rsh" onChange={this.reload} />
					<Input placeholder="Renting Inflation" name="ri" onChange={this.reload} />
					<Input placeholder="Annual after tx return on cash" name="aafroc" onChange={this.reload} />
					<Input placeholder="When sold year" name="wsy" onChange={this.reload} />
					<Input placeholder="Home sold cost rate" name="hscr" onChange={this.reload} />
				</div>
				<div className="OutputSection">
					{this.renderResults()}
				</div>
			</div>
		);
	};
};

ReactDOM.render(<App />, document.querySelector('#root'));