import React from 'react';
import cities from '../../lib/city.list.json';
import moment from 'moment-timezone';
import Head from 'next/head';
import Link from "next/link";
import SearchPanel from "../../components/SearchPanel";
import TodaysWeather from "../../components/TodaysWeather";
import HourlyWeather from "../../components/HourlyWeather";
import WeeklyWeather from '../../components/WeeklyWeather';

export async function getServerSideProps(context) {
    const city = getCity(context.params.city);

    if (!city) {
        return {
            notFound: true
        };
    }

    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${city.coord.lat}&lon=${city.coord.lon}&appid=${process.env.API_KEY}&units=metric&exclude=minutely`
    );

    const data = await response.json();

    if (!data) {
        return {
            notFound: true
        };
    }

    const hourlyWeather = getHourlyWeather(data.hourly, data.timezone);

    return {
        props: {
            city: city,
            timezone: data.timezone,
            currentWeather: data.current,
            weeklyWeather: data.daily,
            hourlyWeather: hourlyWeather
        }
    };
}

const getCity = (params) => {
    const cityParam = params.trim();
    const citySplit = cityParam.split('-');
    const id = citySplit[citySplit.length - 1];

    if (!id) {
        return null;
    }

    const city = cities.find(city => city.id.toString() === id);

    if (city) {
        return city;
    } else {
        return null;
    }
}

const getHourlyWeather = (hourlyData, timezone) => {
    const endOfDay = moment().tz(timezone).endOf('day').valueOf();
    const eodTimeStamp = Math.floor(endOfDay / 1000);

    return hourlyData.filter(data => data.dt < eodTimeStamp);
}

function City({hourlyWeather, weeklyWeather, currentWeather, city, timezone}) {
    return (
        <div>
            <Head>
                <title>{city.name} Weather - Next Weather App</title>
            </Head>
            <div className="page-wrapper">
                <div className="container">
                    <Link href='/'>
                        <a className='back-link'>&larr; Home</a>
                    </Link>
                    <SearchPanel placeholder='Search for another location...' />
                    <TodaysWeather city={city} weather={weeklyWeather[0]} timezone={timezone}/>
                    <HourlyWeather hourlyWeather={hourlyWeather} timezone={timezone} />
                    <WeeklyWeather weeklyWeather={weeklyWeather} timezone={timezone} />
                </div>
            </div>
        </div>
    );
}

export default City;