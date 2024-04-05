export type OutputSamplingGridType = 'UTM' | 'GEO'

export interface Granule {
    id: string,
    timestamp: string,
    uri: string
}

export type State = 
    'NEW' |
    'UNAVAILABLE' |
    'GENERATING' |
    'ERROR' |
    'READY' |
    'AVAILABLE'

export interface Status {
    id: string,
    product: Product,
    timestamp: string,
    state: State,
    reason?: string
}

export interface Product {
    id: string,
    timestamp: string
    cycle: number,
    pass: number,
    scene: number,
    outputGranuleExtentFlag: boolean
    outputSamplingGridType: OutputSamplingGridType,
    rasterResolution: number,
    utmZoneAdjust?: number,
    mgrsBandAdjust?: number
    granules: Granule[],
    status: Status[]
}

export interface CurrentUser {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
    products: Product[]
}

export interface CurrentUserData {
    id: string,
    email: string,
    firstName: string,
    lastName: string,
}

export interface CurrentUserProducts {
    products: Product[]
}

export interface UserResponse {
    currentUser: CurrentUser
}

export type ProductState = 'NEW' | 'UNAVAILABLE' | 'GENERATING' | 'ERROR' | 'READY' | 'AVAILABLE;'

export type GraphqlResponseStatus = 'success' | 'error' | 'unknown'

// Get generated data products
export interface getUserProductsResponse {
    status: GraphqlResponseStatus,
    products?: Product[],
    error?: Error | string,
  }
  
export interface UserProductQueryVariables {
    [key: string]: string
    // after?: string,
    // limit?: string
}

export type PaginationCommand = 'start' | 'previous' | 'next' | 'end'