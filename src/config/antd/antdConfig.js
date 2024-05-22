
export const antdConfig = () => {

    return {
        token: {
            fontFamily: "Montserrat",
            colorPrimary: '#4661E6',
            colorText: '#3a4374',
            colorTextBase: '#3a4374',
        },
        components: {
            Input: {
                fontSize: 16,
                paddingBlock: 8,
                paddingInline: 16,
                borderRadius: 10,
            },
            InputNumber: {
                fontSize: 16,
                paddingBlock: 8,
                paddingInline: 16,
                borderRadius: 10,
            },
            Button: {
                borderRadius: 10,
            },
            Menu: {
                iconSize: 16,
            },
            Tooltip: {
                colorBgSpotlight: '#222222dd'
            },
        }
    }
}