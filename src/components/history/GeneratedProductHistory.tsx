import { Alert, Col, OverlayTrigger, Row, Table, Tooltip, Button, Spinner } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Product, ProductState } from "../../types/graphqlTypes";
import { useEffect, useState } from "react";
import { InfoCircle, Clipboard, Download, ArrowClockwise } from "react-bootstrap-icons";
import { generatedProductsLabels, infoIconsToRender, parameterHelp, productsPerPage } from "../../constants/rasterParameterConstants";
import { getUserProducts } from "../../user/userData";
import { useLocation, useNavigate } from "react-router-dom";
import DataPagination from "./DataPagination";
import HistoryFilters from "./HistoryFilters";
import { Adjust, FilterParameters, OutputGranuleExtentFlagOptions, OutputSamplingGridType, RasterResolution } from "../../types/historyPageTypes";
import { setShowGenerateProductModalTrue, setShowReGenerateProductModalTrue } from "../sidebar/actions/modalSlice";
import ReGenerateProductsModal from "./ReGenerateProductsModal";
import { allProductParameters } from "../../types/constantTypes";
import { setAllUserProducts, setGranulesToReGenerate, setUserProducts } from "../sidebar/actions/productSlice";

export const productPassesFilterCheck = (currentFilters: FilterParameters, cycle: number, pass: number, scene: number, outputGranuleExtentFlag: boolean, status: string, outputSamplingGridType: string, rasterResolution: number, dateGenerated: string, utmZoneAdjust?: number, mgrsBandAdjust?: number): boolean => {
    let productPassesFilter = true
    const outputGranuleExtentFlagMap = ['128 x 128','256 x 128']

    if(currentFilters.cycle !== 'none' && currentFilters.cycle !== String(cycle)) {
        productPassesFilter = false
    }
    if (currentFilters.pass !== 'none' && currentFilters.pass !== String(pass)) {
        productPassesFilter = false
    }
    if (currentFilters.scene !== 'none' && currentFilters.scene !== String(scene)) {
        productPassesFilter = false
    }
    if (currentFilters.outputGranuleExtentFlag.length > 0 && !currentFilters.outputGranuleExtentFlag.includes(outputGranuleExtentFlagMap[+outputGranuleExtentFlag] as OutputGranuleExtentFlagOptions)) {
        productPassesFilter = false
    }
    if (currentFilters.status.length > 0 && !currentFilters.status.includes(status as ProductState)) {
        productPassesFilter = false
    }
    if (currentFilters.outputSamplingGridType.length > 0 && !currentFilters.outputSamplingGridType.includes(outputSamplingGridType as OutputSamplingGridType)) {
        productPassesFilter = false
    }
    if (currentFilters.rasterResolution.length > 0 && !currentFilters.rasterResolution.includes(String(rasterResolution) as RasterResolution)) {
        productPassesFilter = false
    }
    if (utmZoneAdjust !== undefined && currentFilters.utmZoneAdjust.length > 0 && !currentFilters.utmZoneAdjust.includes(String(utmZoneAdjust) as Adjust)) {
        productPassesFilter = false
    }
    if (mgrsBandAdjust !== undefined && currentFilters.mgrsBandAdjust.length > 0 && !currentFilters.mgrsBandAdjust.includes(String(mgrsBandAdjust) as Adjust)) {
        productPassesFilter = false
    }
    if(currentFilters.startDate !== 'none' && new Date(dateGenerated) < currentFilters.startDate) {
        productPassesFilter = false
    }
    if(currentFilters.endDate !== 'none' && new Date(dateGenerated) > currentFilters.endDate) {
        productPassesFilter = false
    }
    return productPassesFilter
}

const GeneratedProductHistory = () => {
    const dispatch = useAppDispatch()
    const colorModeClass = useAppSelector((state) => state.navbar.colorModeClass)
    const userProducts = useAppSelector((state) => state.product.userProducts)
    const allUserProducts = useAppSelector((state) => state.product.allUserProducts)
    const currentFilters = useAppSelector((state) => state.product.currentFilters)
    const { search } = useLocation()
    const navigate = useNavigate()
    const [waitingForDataTableToLoad, setWaitingForDataTableToLoad] = useState<boolean>(false)
    const [totalNumberOfProducts, setTotalNumberOfProducts] = useState<number>(0)
    const [totalNumberOfFilteredProducts, setTotalNumberOfFilteredProducts] = useState<number>(0)
    
    useEffect(() => {
        setWaitingForDataTableToLoad(true)
        // get the data for the first page
        // go through all the user product data to get the id of each one so that 
        const fetchData = async () => {
            await getUserProducts({limit: '1000000'}).then(response => {
                // filter products for what is in the filter
                const allProducts = response.products as Product[]
                setTotalNumberOfProducts(allProducts.length)
                const filteredProducts = allProducts.filter(product => {
                    const {status, utmZoneAdjust, mgrsBandAdjust, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, timestamp: dateGenerated, cycle, pass, scene, granules} = product
                    const statusToUse = status[0].state
                    const utmZoneAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : utmZoneAdjust
                    const mgrsBandAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : mgrsBandAdjust
                    const outputSamplingGridTypeToUse = outputSamplingGridType === 'GEO' ? 'LAT/LON' : outputSamplingGridType
                    const productPassesFilter = productPassesFilterCheck(currentFilters, cycle, pass, scene, outputGranuleExtentFlag, statusToUse, outputSamplingGridTypeToUse, rasterResolution, dateGenerated, utmZoneAdjust, mgrsBandAdjust)
                    if(productPassesFilter) {
                        return product
                    } else {
                        return null
                    }
                })
                setTotalNumberOfFilteredProducts(filteredProducts.length)
                dispatch(setAllUserProducts(filteredProducts))
                const productsPerPageToInt = parseInt(productsPerPage)
                dispatch(setUserProducts(filteredProducts.slice(0, productsPerPageToInt)))
                setWaitingForDataTableToLoad(false)
            })
        }
        fetchData().catch(console.error)
        // if(userProducts.length === 0) fetchData().catch(console.error)
      }, [currentFilters]);
    
    // useEffect(() => {
    //     // get the data for the first page
    //     // go through all the user product data to get the id of each one so that 
    //     const fetchData = async () => {
    //         await getUserProducts({limit: productsPerPage}).then(response => {
    //             const currentPageProducts = response.products as Product[]
    //             if(response.status === 'success' && currentPageProducts.length !== 0) {
    //                 const idToUse = currentPageProducts[currentPageProducts.length-1].id
    //                 dispatch(setUserProducts(currentPageProducts))
    //                 dispatch(setFirstHistoryPageData(currentPageProducts))
    //                 dispatch(addPageToHistoryPageState(idToUse))
    //             }
    //         })
    //     }
        
    //     if(userProducts.length === 0) fetchData().catch(console.error)
    //   }, []);

    // TODO: implement download link copy button
    const [copyTooltipText, setCopyTooltipText] = useState('Click to Copy URL')

    const handleCopyClick = (downloadUrl: string) => {
        navigator.clipboard.writeText(downloadUrl)
        setCopyTooltipText('Copied!')
    }

    const renderInfoIcon = (parameterId: string) => (
        <OverlayTrigger
            placement="right"
            overlay={
                <Tooltip id="button-tooltip">
                {parameterHelp[parameterId]}
              </Tooltip>
            }
        >
           <InfoCircle/>
        </OverlayTrigger>
    )

    const renderCopyDownloadButton = (downloadUrlString: string) => (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id="button-tooltip">
                    Copy
                </Tooltip>
            }
        >
            <Button onClick={() => handleCopyClick(downloadUrlString as string)}><Clipboard color="white" size={18}/></Button>
        </OverlayTrigger>
    )

    const renderDownloadButton = (downloadUrlString: string) => (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id="button-tooltip">
                    Download
                </Tooltip>
            }
        >
            <Button onClick={() => window.open(downloadUrlString, '_blank', 'noreferrer')}><Download color="white" size={18}/></Button>
        </OverlayTrigger>
    )

    const handleOnReGenerateClick = (granuleObjects: Product[]) => {
        dispatch(setGranulesToReGenerate(granuleObjects))
        dispatch(setShowReGenerateProductModalTrue())
    }

    const renderReGenerateSceneButton = (granuleObject: Product) => (
        <OverlayTrigger
            placement="bottom"
            overlay={
                <Tooltip id="button-tooltip">
                    Re-Generate Scene
                </Tooltip>
            }
        >
            <Button onClick={() => handleOnReGenerateClick([granuleObject])}><ArrowClockwise color="white" size={18}/></Button>
        </OverlayTrigger>
    )
    
    const renderColTitle = (labelEntry: string[], index: number) => {
        let infoIcon = infoIconsToRender.includes(labelEntry[0]) ? renderInfoIcon(labelEntry[0]) : null
        let labelId = (labelEntry[0] === 'downloadUrl') ? 'download-url' : ''
        return (
            <th key={`${labelEntry[0]}-${index}`} id={labelId}>{labelEntry[1]} {infoIcon}</th>
        )
    }

    const renderHistoryTable = () => {
        return (
            <Row>
                {<Col xs={2} style={{height: '100%'}}><HistoryFilters /></Col>}

                
                <Col xs={10}>
                    <div style={{padding: '0px 20px 20px 20px'}} id='history-table'>
                    <div className={`table-responsive-generatedProducts table-responsive`}>
                    {
                    totalNumberOfProducts === 0 ?
                    <Row>{productHistoryAlert()}</Row>
                    :<Table bordered hover className={`${colorModeClass}-table`} style={{marginBottom: '0px'}}>
                    <thead>
                    <tr>
                        {Object.entries(generatedProductsLabels).map((labelEntry, index) => renderColTitle(labelEntry, index))}
                    </tr>
                    </thead>
                    <tbody>
                        {userProducts.map((generatedProductObject, index) => {
                            const {id, status, utmZoneAdjust, mgrsBandAdjust, outputGranuleExtentFlag, outputSamplingGridType, rasterResolution, timestamp: dateGenerated, cycle, pass, scene, granules} = generatedProductObject
                            const statusToUse = status[0].state
                            const downloadUrl = granules && granules.length !== 0 ? granules[0].uri.split('/').pop() : 'N/A'
                            const utmZoneAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : utmZoneAdjust
                            const mgrsBandAdjustToUse = outputSamplingGridType === 'GEO' ? 'N/A' : mgrsBandAdjust
                            const outputSamplingGridTypeToUse = outputSamplingGridType === 'GEO' ? 'LAT/LON' : outputSamplingGridType
                            const outputGranuleExtentFlagToUse = outputGranuleExtentFlag ? '256 x 128 km' : '128 x 128 km'
                            const productRowValues = {cycle, pass, scene, status: statusToUse, outputGranuleExtentFlag: outputGranuleExtentFlagToUse, outputSamplingGridType: outputSamplingGridTypeToUse, rasterResolution, utmZoneAdjust: utmZoneAdjustToUse, mgrsBandAdjust: mgrsBandAdjustToUse, downloadUrl, dateGenerated}

                            return (
                                <tr className={`${colorModeClass}-table hoverable-row`} key={`generated-products-data-row-${index}`}>
                                {Object.entries(productRowValues).map((entry, index2) => {
                                    let cellContents = null
                                    if (entry[0] === 'downloadUrl' && entry[1] !== 'N/A') {
                                        const downloadUrlString = granules[0].uri
                                        cellContents = 
                                        <Row className='normal-row'>
                                            <Col>{entry[1]}</Col>
                                            <Col>{(renderCopyDownloadButton(downloadUrlString))}</Col>
                                            <Col>{renderDownloadButton(downloadUrlString)}</Col>
                                        </Row>
                                    } else if (entry[0] === 'status' && entry[1] === 'ERROR') {
                                        cellContents = 
                                        <Row className='normal-row'>
                                            <Col>{entry[1]}</Col>
                                            <Col>{renderReGenerateSceneButton(generatedProductObject)}</Col>
                                            <ReGenerateProductsModal />
                                        </Row>
                                    } else {
                                        cellContents = entry[1]
                                    }
                                    return <td style={{}} key={`${index}-${index2}`}>{cellContents}</td>
                                } )}
                                </tr>
                            )    
                        })}
                    </tbody>
                </Table>
                    }
                    </div>
                    {<DataPagination totalNumberOfProducts={totalNumberOfProducts} totalNumberOfFilteredProducts={totalNumberOfFilteredProducts} />}
                </div>
                </Col>
            </Row>
        )
    }
    
    const productHistoryAlert = () => {
        const alertMessage = 'No products have been generated. Go to the Product Customization page to generate products.'
        return <Col style={{margin: '30px'}}><Alert variant='warning' onClick={() => navigate(`/generatedProductHistory${search}`)} style={{cursor: 'pointer'}}>{alertMessage}</Alert></Col>
    }

    const waitingForProductsToLoadSpinner = () => {
        return (
            <div>
                <h5>Loading Data Table...</h5>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner> 
            </div>
        )
    }

    const renderProductHistoryViews = () => {
        return (
            <Col>
                <Row>{renderHistoryTable()}</Row>
                {/* {allUserProducts.length === 0 ? <Row>{productHistoryAlert()}</Row> : null} */}
            </Col>
        )
    }

    return (
        <>
        <h4 className='normal-row' style={{marginTop: '70px'}}>Generated Products Data</h4>
        <Col className='about-page' style={{marginRight: '50px', marginLeft: '50px'}}>
            <Row className='normal-row'>{totalNumberOfProducts === 0 ? waitingForProductsToLoadSpinner() : renderProductHistoryViews()}</Row>
        </Col>
        </>
    );
}

export default GeneratedProductHistory;