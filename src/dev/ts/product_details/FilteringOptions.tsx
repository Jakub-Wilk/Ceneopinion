import { useState } from "react";
import { FaCheckSquare, FaFilter, FaMinusCircle, FaPlusCircle, FaSquare, FaWindowClose } from "react-icons/fa";
import { Data, Filters } from "../product_details";
import DateRangePicker, { DateRangePickerProps } from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Stars from "../common/Stars";
import equal from "deep-equal";

interface FilteringOptionsProps {
    data: Data
}

function FilteringOptions(props: FilteringOptionsProps) {
    const [isVisible, setVisible] = useState(false);

    const toggleVisible = () => {
        setVisible(!isVisible);
    };

    const time_posted = {
        min: new Date(props.data.filter_data.time_posted.min),
        max: new Date(props.data.filter_data.time_posted.max)
    };

    const time_bought = {
        min: new Date(props.data.filter_data.time_bought.min),
        max: new Date(props.data.filter_data.time_bought.max)
    };

    const urlparams = new URLSearchParams(location.search);
    
    const filter_bounds: Filters = {
        recommended: {true: true, false: true},
        trusted: {true: true, false: true},
        stars: props.data.filter_data.stars,
        time_posted: time_posted,
        time_bought: time_bought,
        upvotes: props.data.filter_data.upvotes,
        downvotes: props.data.filter_data.downvotes
    };

    let filters: Filters;
    if (urlparams.has("filters")) {
        filters = JSON.parse(decodeURIComponent(atob(urlparams.get("filters")!)));
        filters.time_posted = {
            min: new Date(filters.time_posted.min),
            max: new Date(filters.time_posted.max)
        };
        filters.time_bought = {
            min: new Date(filters.time_bought.min),
            max: new Date(filters.time_bought.max)
        };
    } else {
        filters = filter_bounds;
    }
    
    
    const [recommendedState, setRecommendedState] = useState(filters.recommended);
    const [trustedState, setTrustedState] = useState(filters.trusted);
    const [timePostedRange, setTimePostedRange] = useState<DateRangePickerProps["value"]>([filters.time_posted.min, filters.time_posted.max]);
    const [timeBoughtRange, setTimeBoughtRange] = useState<DateRangePickerProps["value"]>([filters.time_bought.min, filters.time_bought.max]);
    const [starsRange, setStarsRange] = useState([filters.stars.min, filters.stars.max]);
    const [upvotesRange, setupvotesRange] = useState([filters.upvotes.min, filters.upvotes.max]);
    const [downvotesRange, setDownvotesRange] = useState([filters.downvotes.min, filters.downvotes.max]);

    const apply_filters = () => {
        const filters: Filters = {
            recommended: recommendedState,
            trusted: trustedState,
            stars: {
                min: starsRange[0],
                max: starsRange[1]
            },
            time_posted: {
                min: (timePostedRange as Date[])[0],
                max: (timePostedRange as Date[])[1]
            },
            time_bought: {
                min: (timeBoughtRange as Date[])[0],
                max: (timeBoughtRange as Date[])[1]
            },
            upvotes: {
                min: upvotesRange[0],
                max: upvotesRange[1]
            },
            downvotes: {
                min: downvotesRange[0],
                max: downvotesRange[1]
            }
        };

        
        const urlparams = new URLSearchParams(location.search);
        if (!equal(filters, filter_bounds)) {
            const payload = btoa(encodeURIComponent(JSON.stringify(filters)));
            urlparams.set("filters", payload);
        } else {
            urlparams.delete("filters");
        }
        
        location.search = urlparams.toString();
    };

    return <div className={`filter ${isVisible ? "filter-visible" : "filter-hidden"}`}>
        <div className="h-full w-full border border-ceneo border-l-0 bg-white rounded-r-lg flex flex-col">
            <div className="w-full flex justify-end p-1"><FaWindowClose color="#FF6400" className="w-6 h-6 relative cursor-pointer" onClick={toggleVisible}/></div>
            <div className="flex flex-col items-center">
                <div className="check-list">
                    <div>Poleca:</div>
                    <div className="check" onClick={() => setRecommendedState({true: !recommendedState.true, false: recommendedState.false})}>
                        {recommendedState.true ? <FaCheckSquare /> : <FaSquare />}
                        <span>Tak</span>
                    </div>
                    <div className="check" onClick={() => setRecommendedState({true: recommendedState.true, false: !recommendedState.false})}>
                        {recommendedState.false ? <FaCheckSquare /> : <FaSquare />}
                        <span>Nie</span>
                    </div>
                </div>
                <div className="check-list">
                    <div className="filter-label">Zaufana:</div>
                    <div className="check" onClick={() => setTrustedState({true: !trustedState.true, false: trustedState.false})}>
                        {trustedState.true ? <FaCheckSquare /> : <FaSquare />}
                        <span>Tak</span>
                    </div>
                    <div className="check" onClick={() => setTrustedState({true: trustedState.true, false: !trustedState.false})}>
                        {trustedState.false ? <FaCheckSquare /> : <FaSquare />}
                        <span>Nie</span>
                    </div>
                </div>
                <div className="filter-label">Gwiazdki:</div>
                <div className="w-4/5">
                    <Slider
                        range
                        value={starsRange}
                        onChange={value => setStarsRange(value as number[])}
                        min={filter_bounds.stars.min}
                        max={filter_bounds.stars.max}
                        step={0.5}
                    />
                </div>
                <div className="flex gap-2 justify-center items-center">
                    <Stars count={starsRange[0]}/>
                    <span>-</span>
                    <Stars count={starsRange[1]}/>
                </div>
                <div className="filter-label">Czas recenzji:</div>
                <DateRangePicker
                    onChange={setTimePostedRange}
                    value={timePostedRange}
                    minDate={filter_bounds.time_posted.min}
                    maxDate={filter_bounds.time_posted.max}
                    closeCalendar={false}
                />
                <div className="filter-label">Czas kupna:</div>
                <DateRangePicker
                    onChange={setTimeBoughtRange}
                    value={timeBoughtRange}
                    minDate={filter_bounds.time_bought.min}
                    maxDate={filter_bounds.time_bought.max}
                    closeCalendar={false}
                />
                <div className="filter-label">Głosy <FaPlusCircle color="#27ae60" />:</div>
                <div className="w-4/5">
                    <Slider
                        range
                        value={upvotesRange}
                        onChange={value => setupvotesRange(value as number[])}
                        min={filter_bounds.upvotes.min}
                        max={filter_bounds.upvotes.max}
                        step={1}
                    />
                </div>
                <div className="flex gap-2 justify-center items-center">
                    <span>{upvotesRange[0]}</span>
                    <span>-</span>
                    <span>{upvotesRange[1]}</span>
                </div>
                <div className="filter-label">Głosy <FaMinusCircle color="#c0392b" />:</div>
                <div className="w-4/5">
                    <Slider
                        range
                        value={downvotesRange}
                        onChange={value => setDownvotesRange(value as number[])}
                        min={filter_bounds.downvotes.min}
                        max={filter_bounds.downvotes.max}
                        step={1}
                    />
                </div>
                <div className="flex gap-2 justify-center items-center mb-10">
                    <span>{downvotesRange[0]}</span>
                    <span>-</span>
                    <span>{downvotesRange[1]}</span>
                </div>
                <div
                    className="button"
                    onClick={apply_filters}
                >
                    Aplikuj filtry
                </div>
            </div>
        </div>
        <FaFilter className={`filter-button ${isVisible ? "filter-button-hidden" : "filter-button-visible"}`} onClick={toggleVisible}/>
    </div>;
}

export default FilteringOptions;