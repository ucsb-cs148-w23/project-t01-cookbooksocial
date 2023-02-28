import React, { useState, useEffect, useRef } from 'react';
import algoliasearch from 'algoliasearch';
import { InstantSearch, SearchBox, Hits, Highlight } from 'react-instantsearch-dom';
import './Search.css'; 

const searchClient = algoliasearch(
  'DEKII3BH6O',
  'fa19416e21b2be5963a65ad53ce49612'
);

const InstantSearchComponent = () => {
  const [showHits, setShowHits] = useState(false);
  const hitsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (hitsRef.current && !hitsRef.current.contains(event.target)) {
        setShowHits(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [hitsRef]);

  return (
    <InstantSearch indexName="Recipe Titles" searchClient={searchClient} hitsPerPage={3}>
      <div style={{ maxWidth: '300px', margin: '0 auto' }}>
        <SearchBox
          translations={{
            placeholder: 'Search for recipes...',
          }}
          onFocus={() => setShowHits(true)}
          style={{ maxWidth: '200px', margin: '0 auto' }}
        />
        {showHits && (
          <div ref={hitsRef}>
            <Hits
              hitComponent={Hit}
              style={{ width: '100%', maxWidth: '500px' }}
              onClick={() => setShowHits(false)}
            />
          </div>
        )}
      </div>
    </InstantSearch>
  );
};

const Hit = ({ hit }) => {
  const recipeUrl = `/recipe/${hit.objectID}`;
  return (
    <a
      href={recipeUrl}
      style={{
        display: 'block',
        border: '1px solid gray',
        borderRadius: '5px',
        padding: '10px',
        margin: '0 0 -1px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'background-color 0.3s ease-in-out',
      }}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = '#eee';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <img
          src={hit.image}
          alt={hit.title}
          style={{ width: '50px', height: '50px', marginRight: '10px' }}
        />
        <div style={{ maxWidth: '500px' }}>
          <Highlight attribute="title" hit={hit} />
        </div>
      </div>
    </a>
  );
};

export default InstantSearchComponent;
