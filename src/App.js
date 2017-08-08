import React, {Component} from 'react';
import './App.css';

const DEFAULT_QUERY = 'redux';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';


/**
 * legacy client-side search function
 */
// function isSearched(searchTerm){
//     return function(item){
//
//         //some condition that returns true or false pg41
//         return !searchTerm ||
//             item.title.toLowerCase().includes(searchTerm.toLowerCase());
//     }
// }

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
             result: null,
             searchTerm: DEFAULT_QUERY,
        };


        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);

    }

    onSearchSubmit(event) {
        const { searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
        event.preventDefault();
    }

    setSearchTopStories(result) {
        this.setState({ result });
    }

    fetchSearchTopStories(searchTerm){
        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(e => e);
    }

    componentDidMount(){
        const { searchTerm } = this.state;
        this.fetchSearchTopStories(searchTerm);
        //console.log(this.state);
    }

    onSearchChange(event) {
        this.setState({ searchTerm: event.target.value});

    }



    onDismiss(id){

        //function isNotId(item){
        //    return item.objectID !== id;
        //}

        //*const isNotId = item => item.objectID !== id;

        //*const updatedResult = this.state.result.filter(isNotId);

        const updatedResult = this.state.result.hits.filter(item => item.objectID !== id);
        this.setState({
            result: { ...this.state.result, hits: updatedResult }
        });

    }

    render() {
        const {searchTerm, result} = this.state;
        return (
            <div className="page">
                <div className="interactions">

                <Search
                    value={searchTerm}
                    onChange={this.onSearchChange}
                    onSubmit={this.onSearchSubmit}
                >
                    Search
                </Search>
                </div>
                { result &&
                     <Table
                        result={result.hits}
                        onDismiss={this.onDismiss}
                    />
                }
            </div>
        );
    }
}

/**
 * refactored Table component to a stateless functional component
 */

const Table = ({ result, onDismiss }) =>
    <div className="table">
        { result.map(item =>
            <div key={item.objectID} className="table-row">
                <span style={{ width: '40%' }}>
                    <a href={item.url}>{item.title}</a>
                </span>
                <span style ={{ width: '30%' }}>
                    {item.author}
                </span>
                <span style ={{ width: '10%' }}>
                    {item.num_comments}
                </span>
                <span style={{ width: '10%' }}>
                    {item.points}
                </span>
                <span style={{ width: '10%'}}>
                    <button
                        onClick={() => onDismiss(item.objectID)}
                        className="button-inline"
                    >
                        Dismiss
                    </button>
                </span>
            </div>
        )}
    </div>;



// remember to replace <button with <Button



// class Search extends Component {
//     render() {
//         const { value, onChange, children } = this.props;
//         return (
//             <form>
//                 {children} <input
//                     type="text"
//                     value={value}
//                     onChange={onChange}
//                 />
//             </form>
//         );
//     }
// }

/**
 * refactored Search component to a stateless functional component
 */

const Search = ({
    value,
    onChange,
    onSubmit,
    children
}) =>
    <form onSubmit={onSubmit}>
        <input
            type="text"
            value={value}
            onChange={onChange}
        />
        <button type="submit">
            {children}
        </button>
    </form>;







// class Table extends Component {
//     render() {
//         const { result, pattern, onDismiss } = this.props;
//         return (
//             <div>
//                 { result.filter(isSearched(pattern)).map(item =>
//                 <div key={item.objectID}>
//                     <span>
//                         <a href={item.url}>{item.title}</a>
//                     </span>
//                     <span>{item.author}</span>
//                     <span>{item.num_comments}</span>
//                     <span>{item.points}</span>
//                     <span>
//                         <Button onClick={() => onDismiss(item.objectID)}>
//                           Dismiss
//                         </Button>
//                     </span>
//                 </div>
//                 )}
//             </div>
//         );
//     }
// }

/**
 * Now whenever there is no 'className' property the value will be an empty string.
 */

// class Button extends Component {
//     render() {
//         const {
//             onClick,
//             className = '',
//             children,
//         } = this.props;
//     }
// }


/**
 * refactored Button component to a stateless functional component
 */

// const Button = ({onClick, className, children}) =>
//
// {
//
//         onClick,
//         className = '',
//         children,
//       this.props;
// };

    // can remove the return statement since an implicit return is attached

    // return (
    //     this.props
    // );


export default App;


