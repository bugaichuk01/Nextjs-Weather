import React, {useEffect, useState} from 'react';
import cities from '../lib/city.list.json';
import Link from "next/link";
import {Router} from "next/router";

function SearchPanel({placeholder}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        const clearQuery = () => setQuery('');

        Router.events.on('routeChangeComplete', clearQuery);

        return () => {
            Router.events.on('routeChangeComplete', clearQuery);
        }
    }, [])

    const handleChange = (event) => {
        const value = event.target.value;
        setQuery(value);

        let coincidences = [];

        if(value.length > 3) {
            for (let city of cities) {
                if(coincidences.length >= 5) {
                    break;
                }
                if(city.name.toLowerCase().startsWith(value.toLowerCase())) {
                    const cityData = {
                        ...city,
                        slug: `${city.name.toLowerCase().replace(/ /g, '-')}-${city.id}`
                    }
                    coincidences.push(cityData);
                }
            }
        }
        setResults(coincidences);
    };

    return (
        <div className="search">
            <input type="text" value={query} onChange={handleChange} placeholder={placeholder ? placeholder : ''}/>
            {query.length > 3 && (
                <ul>
                    {results.length > 0 ? (
                        results.map((city) => (
                            <li key={city.slug}>
                                <Link href='/location/[city]' as={`/location/${city.slug}`}>
                                    <a>
                                        {city.name}
                                        {city.state ? `, ${city.state}` : ''}
                                        <span>({city.country})</span>
                                    </a>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="search__no-results">No results found</li>
                    )}
                </ul>
            )}
        </div>
    );
}

export default SearchPanel;