type Template = {
    id: string
    name: string
    bg: string
    gradient?: Gradient
    url?: string
    color: string
    premium?: boolean
  }

  type Gradient ={
    type:string
    angle:number
    color1:string
    percentage1:string
    color2: string
    percentage2:string
  }