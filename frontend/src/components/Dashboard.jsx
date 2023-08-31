import { styled } from 'styled-components'
import Wrapper from '../Styles/CommonStyles'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionData } from '../store/slices/transactionSlice'
import { fetchStats } from '../store/slices/statsSlice'
import loadingImage from '../image/loading.gif'
import MonthDropdown from './MonthDropdown';

const Div = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 3rem;
`

const Table = styled.table`
    margin: 2rem 0 2rem 0;
    width: 100%;
    color: white;
    border: 1px solid white;

    thead, tbody td{
        border: 1px solid white;
    }

    tbody tr td:nth-child(7){
        width: 100px;
        height: 100px;
        overflow: hidden;
    }

    td{
        padding: 1rem;
        text-align: center;
    }

    tbody tr td img{
        object-fit: cover;
    }
`

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    gap: 2rem;

    button{
        background-color: white;
        color: black;
        padding: 0.5rem 1rem;
        border-radius: 5px;
    }

    button:disabled{
        opacity: 0.5;
    }
`

const IMG = styled.img`
    width: 50px;
    height: 50px;
    margin: auto;
`

const StatisticsContainer = styled.div`
    padding: 1rem;
    width: 500px;
    margin: auto;
    background-color: white;
    border-radius: 5px;
`

const Para = styled.p`
    width: 100%;
    color: black;
    display: flex;
    justify-content: space-between;
`

export default function Dashboard() {
    const [search, setSearch] = useState('');
    const [month, setMonth] = useState('');
    const [statsMonth, setStatsMonths] = useState('');
    const [page, setPage] = useState(1);
    const { transactionData, isLoading, pageInfo } = useSelector((state) => state.transactions);
    const statsData = useSelector((state) => state.stats.filteredData);
    const { totalPages = 1 } = pageInfo;
    const dispatch = useDispatch();


    const queryParams = {
        search: search,
        page: page,
        month: month,
        maxResult: 10,
    };

    let debounceTimeout;
    const debouncedFetch = () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            dispatch(fetchTransactionData(queryParams));
        }, 1000);
    };

    useEffect(() => {
        if (search || month) {
            setPage(1);
        }
        debouncedFetch();
        return () => clearTimeout(debounceTimeout);
    }, [search, month, page]);

    useEffect(() => {
        dispatch(fetchStats({ month: statsMonth }));
    }, [statsMonth]);

    return (
        <Wrapper>
            <h1>Transaction Statistics</h1>
            <StatisticsContainer>
                <MonthDropdown month={statsMonth} setMonth={setStatsMonths} />
                {statsData && Object.keys(statsData).length > 0 && (
                    <>
                        <Para><span>Total Sale</span><span>{Math.round(statsData.totalNotSoldItems)}</span></Para>
                        <Para><span>Total sold item</span><span>{Math.round(statsData.totalSaleAmount)}</span></Para>
                        <Para><span>Total not sold item</span><span>{Math.round(statsData.totalSoldItems)}</span></Para>
                    </>
                )}
            </StatisticsContainer>
            <hr style={{ margin: "2rem 2rem" }} />
            <h1>Transaction Dashboard</h1>
            <Div>
                <input type="text" className='rounded-xl' placeholder='Seach' value={search} onChange={(e) => setSearch(e.target.value)} />

                <Pagination>
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</button>
                    <p>{`${page} / ${totalPages}`}</p>
                    <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </Pagination>

                <MonthDropdown month={month} setMonth={setMonth} />
            </Div>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>

                <tbody>
                    {!isLoading && transactionData.length === 0 && <tr><td colSpan={7}>No data available for this month.</td></tr>}
                    {!isLoading && transactionData && transactionData.map((transaction) => (
                        <tr key={transaction._id}>
                            <td>{transaction._id}</td>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.price}</td>
                            <td>{transaction.category}</td>
                            <td>{transaction.sold ? "sold" : "not sold"}</td>
                            <td>
                                <img src={transaction.image} alt={transaction.title} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {isLoading && <IMG className='loading' src={loadingImage} alt="" />}
        </Wrapper>
    )
}
