import { Pagination } from "react-bootstrap";
import { Product, getUserProductsResponse } from "../../types/graphqlTypes";
import { getUserProducts } from "../../user/userData";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setHistoryPageStateNext, setHistoryPageStatePrevious, setHistoryPageStateStart, setUserProducts } from "../sidebar/actions/productSlice";
import { productsPerPage } from "../../constants/rasterParameterConstants";
import { useState } from "react";

const DataPagination = () => {
    const dispatch = useAppDispatch()
    // const currentDataPageId = useAppSelector((state) => state.product.currentDataPageId)
    // const previousDataPageId = useAppSelector((state) => state.product.previousDataPageId)
    // const twoBackDataPageId = useAppSelector((state) => state.product.twoBackDataPageId)
    // const firstProducts = useAppSelector((state) => state.product.firstProducts)
    const historyPageState = useAppSelector((state) => state.product.historyPageState)
    const historyPageIndex = useAppSelector((state) => state.product.historyPageIndex)
    const firstHistoryPageData = useAppSelector((state) => state.product.firstHistoryPageData)
    const userProducts = useAppSelector((state) => state.product.userProducts)
    const [noNextPage, setNoNextPage] = useState<boolean>(false)
    const [noPreviousPage, setNoPreviousPage] = useState<boolean>(false)

    const handleStart = () => {
        if(noNextPage) setNoNextPage(false)
        dispatch(setUserProducts(firstHistoryPageData))
        dispatch(setHistoryPageStateStart())
    }
    
    const handlePrevious = async () => {
        if(noNextPage) setNoNextPage(false)
        if (historyPageIndex <= 2) {
            dispatch(setUserProducts(firstHistoryPageData))
            dispatch(setHistoryPageStatePrevious())
            setNoPreviousPage(true)
        } else {
            await getUserProducts({limit: productsPerPage, after: historyPageState[historyPageIndex-2]}).then(response => {
                const currentPageProducts = response.products as Product[]
                dispatch(setUserProducts(currentPageProducts))
                dispatch(setHistoryPageStatePrevious())
            })
        }
    }
    
    const handleNext = async () => {
        await getUserProducts({limit: productsPerPage, after: historyPageState[historyPageIndex-1]}).then(response => {
            if(response.status === 'success') {
                const currentPageProducts = response.products as Product[]
                const idToUse = currentPageProducts[currentPageProducts.length-1].id
                dispatch(setUserProducts(currentPageProducts))
                dispatch(setHistoryPageStateNext(idToUse))
            } else if (response.status === 'error') {
                setNoNextPage(true)
            }
        })
    }
    
    const handleEnd = async (localPageState: string[], localPageIndex: number) => {
        const localPageStateToUse = [...localPageState]
        await getUserProducts({limit: productsPerPage, after: localPageStateToUse[localPageIndex-1]}).then(response => {
            const currentPageProducts = response.products as Product[]
            if(response.status === 'success' && currentPageProducts.length !== 0) {
                const idToUse = currentPageProducts[currentPageProducts.length-1].id
                dispatch(setUserProducts(currentPageProducts))
                dispatch(setHistoryPageStateNext(idToUse))

                if(!localPageStateToUse.includes(idToUse)) {
                    localPageStateToUse.push(idToUse)
                }
                handleEnd(localPageStateToUse,localPageIndex + 1)
            } else if (response.status === 'error' || currentPageProducts.length === 0) {
                setNoNextPage(true)
            }
            return response
        })
    }
    
    return (
        <div className="center">
            <Pagination style={{padding: '15px'}}>
                {/* <Pagination.First linkClassName="pagination-link-item"/> */}
                <Pagination.First onClick={() => handleStart()} disabled={noPreviousPage}>{`<< Start`}</Pagination.First>
                <Pagination.Prev onClick={() => handlePrevious()} disabled={noPreviousPage}>{`< Previous`}</Pagination.Prev>
                <Pagination.Next onClick={() => handleNext()} disabled={userProducts.length < parseInt(productsPerPage) || noNextPage}>{`Next >`}</Pagination.Next>
                <Pagination.Last onClick={() => handleEnd(historyPageState, historyPageIndex)} disabled={userProducts.length < parseInt(productsPerPage) || noNextPage}>{`End >>`}</Pagination.Last>
            </Pagination>
        </div>
    );
}

export default DataPagination;
