import { useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<ThunkAppDispatch>;

export const useAppSelector = useSelector;
