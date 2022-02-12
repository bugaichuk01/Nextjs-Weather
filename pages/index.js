import Head from 'next/head'
import SearchPanel from "../components/SearchPanel";

export default function Home() {
    return (
        <div>
            <Head>
                <title>Weather App - Next</title>
            </Head>

            <div className="home">
                <div className="container">
                    <SearchPanel placeholder='Search for a city...' />
                </div>
            </div>
        </div>
    )
}
