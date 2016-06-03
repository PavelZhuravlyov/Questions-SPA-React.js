(function() {
	var questions = [
		{ 
			text: "My question1",
			answers: [
				{ count: 1, text: "My answer1" },
				{ count: 2, text: "My answer2" }
			]
		},
		{ 
			text: "My question2",
			answers: [
				{ count: 1, text: "My answer1.2" },
				{ count: 2, text: "My answer2.2" }
			]
		},
		{ 
			text: "My question3",
			answers: [
				{ count: 1, text: "My answer1.3" },
				{ count: 2, text: "My answer2.3" }
			]
		}
	],
	questLength = questions.length - 1,
	i = 0;

	window.ee = new EventEmitter();
		

	var Question = React.createClass({
		getInitialState: function() {
			return {
				question: this.props.data[i]
			};
		},

		componentDidMount: function() {
	    var self = this;

	    window.ee.addListener('Next', function(i) {
	      self.setState({question: questions[i]});
	    });
	  },

	  componentWillUnmount: function() {
	    window.ee.removeListener('Next');
	  },

		render: function() {
			return (
				<div className="question">
					<p>{this.state.question.text}</p>
					<Answers data={questions}/>
					<NextQuestBtn/>
				</div>
			);
		}
	});

	var Answers = React.createClass({
		getInitialState() {
	    return {
	      answer: this.props.data[i].answers 
	    };
		},

		componentDidMount: function() {
	    var self = this;

	    window.ee.addListener('Next', function(i) {
	      self.setState({answer: self.props.data[i].answers});
	    });
	  },

	  componentWillUnmount: function() {
	    window.ee.removeListener('Next');
	  },

	  handlerChange: function(e) {
	  	var 
	  		count = parseInt(e.target.getAttribute('data-count'));

	  	window.ee.emit('NextQuestBtn.addElem', count, i);
	  },

		render: function() {
			var self = this;
			var answersNode = this.state.answer.map(function(item){
				return (
					<label className='answer-block'>
	          <input 
	          	type='radio' 
	          	data-count={item.count}
	          	className='inp-radio' 
	          	defaultChecked={false} 
	          	ref='answer'  
	          	name="answer"
	          	onChange={self.handlerChange}
	          />
	        	<span>{item.text}</span>
	        </label>
				);
			});

			$('.inp-radio').attr('checked', false);
			
			return (
				<form action="#">
					{answersNode}
				</form>
			);
		}
	});

	var NextQuestBtn = React.createClass({
		getInitialState: function() {
	    return {
	      answNumArray: []    
	    };
		},

		componentDidMount: function() {
	    var self = this;

	    window.ee.addListener('NextQuestBtn.addElem', function(count, i) {
	    	var answNumArray = self.state.answNumArray;
	    	
	    	answNumArray[i] = count;
	      self.setState({answNumArray: answNumArray});

	      console.log(self.state.answNumArray);
	    });
	  },

	  componentWillUnmount: function() {
	    window.ee.removeListener('NextQuestBtn.addElem');
	  },

		nextQuestion: function() {
			if (i == questLength) {
				return false;
			} 

			i++;
			window.ee.emit('Next', i);
		},

		render: function() {
			return (
				<button
					className="btn"
					onClick={this.nextQuestion}
				>
				Отправить
				</button>
			)
		}
	});

	ReactDOM.render(
	  <Question data={questions}/>,
	  document.getElementById('content')
	);
})();