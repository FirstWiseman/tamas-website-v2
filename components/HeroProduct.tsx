const HeroProduct = ({ title, title2, imageSrc }: { title: string, title2: string, imageSrc: string }) => {
  return (
    <div className="h-full w-full">
      {/* <Image width={800} alt="Product5" src="/images/products/Product5.jpg" /> */}
      <div className="absolute top-0 left-0 bg-radial to-black from-transparent from-5% w-full h-full overflow-hidden">
        <div className="absolute flex flex-col gap-[.15vh] top-[50vh] left-[6vh] text-[#ededed] text-left">
          <h1 className="text-color-gradient">{title}</h1>
          <h1 className="text-shadow">{title2}</h1>
          <div className="rounded-md px-5 py-2 ml-2 mt-[2vh] max-w-fit outline-neutral-300/15 outline-1 font-medium bg-black/20 backdrop-blur-md">
            Jetzt Entdecken
          </div>
        </div>
        <div className="absolute flex flex-col gap-3 bottom-[3vh] left-[50%] -translate-x-1/2 items-center justify-center">
          <p className="text-white text-sm tracking-[.4rem]">Mehr entdecken</p>
          <img className="w-[4vh]" src="/svg/arrow_down.svg" alt="Mehr entdecken" />
        </div>
        <img className="absolute -z-40 max-h-full w-full" src={imageSrc} />
      </div>
    </div>
  )

}

export default HeroProduct;