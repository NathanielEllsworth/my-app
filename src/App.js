import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {sortBy} from "lodash";
import classNames from 'classnames';
import './App.css';

const DEFAULT_QUERY = 'redux';
const DEFAULT_PAGE = 0;
const DEFAULT_HPP = '100';

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';


//import sortBy from 'lodash'
const SORTS = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENTS: list => sortBy(list, 'num_comments').reverse(), // to see the items with the highest comments
    POINTS: list => sortBy(list, 'points').reverse(), // to see the items with the highest points
};

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
    const {searchKey, results} = prevState;

    const oldHits = results && results[searchKey]
        ? results[searchKey].hits
        : [];

    const updatedResult = [
        ...oldHits,
        ...hits
    ];

    return {
        results: {
            ...results,
            [searchKey]: {hits: updatedResult, page}
        },
        isLoading: false
    };
};


class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            results: null,
            searchKey: '',
            searchTerm: DEFAULT_QUERY,
            isLoading: false,
        };


        this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
        this.setSearchTopStories = this.setSearchTopStories.bind(this);
        this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onSearchSubmit = this.onSearchSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);

    }


    needsToSearchTopStories(searchTerm) {
        return !this.state.results[searchTerm];
    }


    setSearchTopStories(result) {
        // first get hits and page from result
        const {hits, page} = result;

        this.setState(updateSearchTopStoriesState(hits, page));
    }

    fetchSearchTopStories(searchTerm, page) {
        this.setState({isLoading: true});

        fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
            .then(response => response.json())
            .then(result => this.setSearchTopStories(result))
            .catch(e => e);
    }

    componentDidMount() {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});
        this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
        //console.log(this.state);
    }

    onSearchSubmit(event) {
        const {searchTerm} = this.state;
        this.setState({searchKey: searchTerm});
        this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);

        if (this.needsToSearchTopStories(searchTerm)) {
            this.fetchSearchTopStories(searchTerm, DEFAULT_PAGE);
        }

        event.preventDefault();
    }

    onSearchChange(event) {
        this.setState({searchTerm: event.target.value});
    }


    onDismiss(id) {

        const {searchKey, results} = this.state;
        const {hits, page} = results[searchKey];

        const isNotId = item => item.objectID !== id;
        const updatedResult = hits.filter(isNotId);

        this.setState({
            results: {
                ...results,
                [searchKey]: {hits: updatedResult, page}
            }
        });
    }

    render() {
        const {
            searchTerm,
            results,
            searchKey,
            isLoading
        } = this.state;

        const page = (
            results &&
            results[searchKey] &&
            results[searchKey].page
        ) || 0;

        const list = (
            results &&
            results[searchKey] &&
            results[searchKey].hits
        ) || [];

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

                <Table
                    list={list}
                    onDismiss={this.onDismiss}
                />

                <div className="interactions">
                    <ButtonWithLoading
                        isLoading={isLoading}
                        onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
                        More
                    </ButtonWithLoading>
                </div>
            </div>
        );
    }
}

// npm run test

/**
 * refactored Table component to a stateless functional component
 */

class Table extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sortKey: 'NONE',
            isSortReverse: false,
        };

        this.onSort = this.onSort.bind(this);
    }

    onSort(sortKey) {
        const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
        this.setState({sortKey, isSortReverse});
    }

    render() {
        const {
            list,
            onDismiss
        } = this.props;

        const {
            sortKey,
            isSortReverse
        } = this.state;

        const sortedList = SORTS[sortKey](list);
        const reverseSortedList = isSortReverse
            ? sortedList.reverse()
            : sortedList;


        return (
            <div className="table">
                <div className="table-header">
            <span style={{width: '40%'}}>
                <Sort
                    sortKey={'TITLE'}
                    onSort={this.onSort}
                    activateSortKey={sortKey}
                >
                    Title
                </Sort>
            </span>
                    <span style={{width: '30%'}}>
                <Sort
                    sortKey={'AUTHOR'}
                    onSort={this.onSort}
                    activateSortKey={sortKey}
                >
                    Author
                </Sort>
            </span>
                    <span style={{width: '10%'}}>
                <Sort
                    sortKey={'COMMENTS'}
                    onSort={this.onSort}
                    activateSortKey={sortKey}
                >
                    Comments
                </Sort>
            </span>
                    <span style={{width: '10%'}}>
                <Sort
                    sortKey={'POINTS'}
                    onSort={this.onSort}
                    activateSortKey={sortKey}
                >
                    Points
                </Sort>
            </span>
                    <span style={{width: '10%'}}>
                Archive
            </span>
                </div>
                {reverseSortedList.map(item =>
                        <div key={item.objectID} className="table-row">
                <span style={{width: '40%'}}>
                    <a href={item.url}>{item.title}</a>
                </span>
                            <span style={{width: '30%'}}>
                    {item.author}
                </span>
                            <span style={{width: '10%'}}>
                    {item.num_comments}
                </span>
                            <span style={{width: '10%'}}>
                    {item.points}
                </span>
                            <span style={{width: '10%'}}>
                    <Button
                        onClick={() => onDismiss(item.objectID)}
                        className="button-inline"
                    >
                        Dismiss
                    </Button>
                </span>
                        </div>
                )}
            </div>
        );
    }
}

Table.propTypes = {
    list: PropTypes.arrayOf(
        PropTypes.shape({
            objectID: PropTypes.string.isRequired,
            author: PropTypes.string,
            url: PropTypes.string,
            num_comments: PropTypes.number,
            points: PropTypes.number,
        })
    ).isRequired,
    onDismiss: PropTypes.func.isRequired,
};


/**
 * refactored Search component to a stateless functional component
 *
 * accessing the DOM! (media playback, animations, etc) **pg 119**
 */

const Search = ({
                    value,
                    onChange,
                    onSubmit,
                    children
                }) => {
    let input; //here**
    return (
        <form onSubmit={onSubmit}>
            <input
                type="text"
                value={value}
                onChange={onChange}
                ref={(node) => input = node} //here**
            />
            <button type="submit">
                {children}
            </button>
        </form>
    );
};


/**
 * refactored Button component to a stateless functional component
 */

const Button = ({
                    onClick,
                    className,
                    children
                }) =>
    <button
        onClick={onClick}
        className={className}
        type="button"
    >
        {children}
    </button>;


Button.defaultProps = {
    className: '',
};

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
};


const Loading = () =>
    <div>Loading ...</div>;

/**
 * Higher Order Components
 */

const withLoading = (Component) => ({isLoading, ...rest}) =>
    isLoading ? <Loading/> : <Component {...rest} />;

const ButtonWithLoading = withLoading(Button);


/**
 * Sort function
 */

const Sort = ({
                  sortKey,
                  activeSortKey,
                  onSort,
                  children
              }) => {
    const sortClass = classNames(
        'button-inline',
        {'button-active': sortKey === activeSortKey}
    );

    return (
        <Button
            onClick={() => onSort(sortKey)}
            className={sortClass}
        >
            {children}
        </Button>
    );
};


export default App;

export {
    Button,
    Search,
    Table,
};