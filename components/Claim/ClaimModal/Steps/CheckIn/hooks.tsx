import { useEffect, useState } from "react";

type Position = {
    latitude: number;
    longitude: number;
};

type Error = {
    code: number;
    message: string;
};

export const usePosition = (): [Position|null, Error|null, boolean] => {
    const [position, setPosition] = useState<Position|null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        let mounted = true;
        if (mounted) {
            setLoading(true)
            getLocation();
        }
        return () => {
            mounted = false;
        };
    }, []);

    const onLocationSuccess = (pos: GeolocationPosition) => {
        setPosition({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
        });
        setLoading(false)
    };

    const onLocationError = (err: GeolocationPositionError) => {
        if (!position) {
            alert("Please grant permissions to access your location.");
            setError({
                code: err.code,
                message: err.message,
            });
        }
        setLoading(false)
    };

    const locationOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };

    const getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                onLocationSuccess,
                onLocationError,
                locationOptions
            );
        } else {
            alert("This browser does not allow permission tracking");
        }
    };

    return [position, error, loading];
};