import React, {Component} from 'react';
import './App.css';

const list = [
    {
        title: 'React',
        url: 'https://facebook.github.io/react/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
    },
    {
        title: 'Redux',
        url: 'https://github.com/reactjs/redux',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        pojectID: 1,
    },
];

function isSearched(searchTerm){
    return function(item){

        //some condition that returns true or false pg41
        return !searchTerm ||
            item.title.toLowerCase().includes(searchTerm.toLowerCase());
    }
}

class App extends Component {

    constructor(props){
        super(props);

        this.state = {
             list: list,
             searchTerm:'',
        };

        this.onSearchChange = this.onSearchChange.bind(this);
        this.onDismiss = this.onDismiss.bind(this);

    }

    onSearchChange(event) {
        this.setState({ searchTerm: event.target.value});

    }

    onDismiss(id){

        //function isNotId(item){
        //    return item.objectID !== id;
        //}

        //*const isNotId = item => item.objectID !== id;

        //*const updatedList = this.state.list.filter(isNotId);

        const updatedList = this.state.list.filter(item => item.objectID !== id);
        this.setState({ list: updatedList });

    }

    render() {
        const {searchTerm, list} = this.state;
        return (
            <div className="page">
                <div className="interactions">

                <Search
                    value={searchTerm}
                    onChange={this.onSearchChange}
                >
                    Search
                </Search>
                </div>

                <Table
                    list={list}
                    pattern={searchTerm}
                    onDismiss={this.onDismiss}
                />

            </div>
        );
    }
}

/**
 * refactored Table component to a stateless functional component
 */

const Table = ({ list, pattern, onDismiss }) =>
    <div className="table">
        { list.filter(isSearched(pattern)).map(item =>
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

const Search = ({value, onChange, children}) =>
    <form>
        {children} <input
            type="text"
            value={value}
            onChange={onChange}
        />
    </form>;



// class Table extends Component {
//     render() {
//         const { list, pattern, onDismiss } = this.props;
//         return (
//             <div>
//                 { list.filter(isSearched(pattern)).map(item =>
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


