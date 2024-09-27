export const fileFilter = (
  res: Request,
  file: Express.Multer.File,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callback: Function,
) => {
  if (!file) return callback(new Error('File is Empty'), false);

  const fileExtension = file.mimetype.split('/')[1];
  const validExtension = ['jpg', 'jpeg', 'png', 'gif'];
  if (validExtension.includes(fileExtension)) {
    return callback(null, true);
  }

  callback(null, false);
};
