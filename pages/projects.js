import Airtable from "airtable"
import ProjectList from "../components/ProjectList";
import ProjectListEntry from "../components/ProjectListEntry";
import { getProjectObject } from "../utils/getProject";
import Link from 'next/link'
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faSearch, faArrowRight} from '@fortawesome/free-solid-svg-icons'

export async function getStaticProps(context) {

  const airtable = new Airtable({
    apiKey: process.env.AIRTABLE_API_KEY,
  });

  const records = await airtable
    .base('apptXJJeHse3v7SAS')('Projects')
    .select({
      fields: ['Name', 'Slug', 'Last Modified', 'Record status', 'Address', 'Uses', 'Status', 'Synopsis'],
      sort: [{field: 'Last Modified', direction: 'desc'}],
      filterByFormula: process.env.NODE_ENV === 'production' ? process.env.RECORD_FILTER : process.env.DEV_RECORD_FILTER
    })
    .all();
  
  const projects = records.map((project) => getProjectObject(project));

  return {
    props: {
      projects,
    },
  };
}

export default function ListPage({ projects }) {

  let [value, setValue] = useState('')
  let [searchValue, setSearchValue] = useState('')

  return (
    <div className="max-w-xl mx-auto">
      <h3 className="text-xl leading-6 pb-6">List of Detroit development projects</h3>
      <p className="text-lg leading-7 mb-8 font-light">
        Search for developments or browse the list, then click on any project for more details. 
        <span className="italic"> See something missing? Report it <Link href={`/submit-a-tip`}>here</Link></span>.
      </p>
      <div className="border-1 border-black flex items-center justify-around bg-white">
        <FontAwesomeIcon icon={faSearch} className="text-xl h-4 ml-4 mr-3 bg-white text-searchblue" />
        <input type="text" className="w-full p-2" id="search" value={value} placeholder="Search for a project" onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setSearchValue(value) } />
        <button className="border-l-1 border-black bg-seafoam h-10 w-28 flex items-center justify-around" onClick={() => setSearchValue(value)} >
          <FontAwesomeIcon icon={faArrowRight} className="h-4" />
        </button>
      </div>
      <p className="mt-4 italic text-sm text-gray-500 leading-5 font-light">
        Try searching for a street, developer, use (like “residential” or “hotel”), status (like “under construction” or “proposed”) or whatever is on your mind.
      </p>
      <ProjectList projects={projects} search={searchValue}/>
    </div>
  )
}