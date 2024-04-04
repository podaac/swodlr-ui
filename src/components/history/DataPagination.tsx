import { Button, ButtonGroup, Pagination } from "react-bootstrap";
import { Product } from "../../types/graphqlTypes";
import { getUserProducts } from "../../user/userData";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setHistoryPageStateNext, setHistoryPageStatePrevious, setHistoryPageStateStart, setUserProducts } from "../sidebar/actions/productSlice";
import { productsPerPage } from "../../constants/rasterParameterConstants";
import { useState } from "react";
import { ChevronBarLeft, ChevronBarRight, ChevronCompactLeft, ChevronCompactRight } from "react-bootstrap-icons";

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
    const [noPreviousPage, setNoPreviousPage] = useState<boolean>(true)

    const handleStart = () => {
        if(noNextPage) setNoNextPage(false)
        setNoPreviousPage(true)
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
            console.log('historyPageState: ',historyPageState)
            console.log('historyPageIndex: ',historyPageIndex)
            await getUserProducts({limit: productsPerPage, after: historyPageState[historyPageIndex-3]}).then(response => {
                const currentPageProducts = response.products as Product[]
                console.log('response: ',response)
                dispatch(setUserProducts(currentPageProducts))
                dispatch(setHistoryPageStatePrevious())
            })
        }
    }
    
    const handleNext = async () => {
        await getUserProducts({limit: productsPerPage, after: historyPageState[historyPageIndex-1]}).then(response => {
            if(response.status === 'success') {
                if(noPreviousPage) setNoPreviousPage(false)
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
                if(noPreviousPage) setNoPreviousPage(false)
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
                <ButtonGroup className="mb-2">
                    <Button style={{border: '#FAF9F6 solid 1px'}} onClick={() => handleStart()} disabled={noPreviousPage}><ChevronBarLeft color="white" size={18}/>Start</Button>
                    <Button style={{border: '#FAF9F6 solid 1px'}} onClick={() => handlePrevious()} disabled={noPreviousPage}><ChevronCompactLeft color="white" size={18}/>Previous</Button>
                    <Button style={{border: '#FAF9F6 solid 1px'}} onClick={() => handleNext()} disabled={userProducts.length < parseInt(productsPerPage) || noNextPage}>Next<ChevronCompactRight color="white" size={18}/></Button>
                    <Button style={{border: '#FAF9F6 solid 1px'}} onClick={() => handleEnd(historyPageState, historyPageIndex)} disabled={userProducts.length < parseInt(productsPerPage) || noNextPage}>End<ChevronBarRight color="white" size={18}/></Button>
                </ButtonGroup>
            </Pagination>
        </div>
    );
}

export default DataPagination;
