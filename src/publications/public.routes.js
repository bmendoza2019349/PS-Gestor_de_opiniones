import { Router } from 'express';
import { check } from 'express-validator';
import { publicPost, publicPut, publicDelete, addComment, deleteComment, updateComment, getComments } from './public.controller.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from "../middlewares/validar-jwt.js";
import { existePublicById } from "../helpers/db-validartors.js";
import { validarUser } from "../middlewares/validar-users.js";
import { validarPublic } from "../middlewares/validar-public.js";
import { validatePublicComentD, validateUpdateComment } from "../middlewares/valid-publications.js";

const router = Router();

router.post(
  "/",
  [
    validarJWT,
    validarPublic,
    check("title", "The title is mandatory").not().isEmpty(),
    check("category", "Invalid category").custom((value) => {
      return ["Estado", "Historia", "Actividad", "Evento", "Recuerdo"].includes(value);
    }),
    check("content", "The content is mandatory").not().isEmpty(),
    validarCampos,
  ],
  publicPost
);

router.put(
  "/:id", // Assuming you are passing the id as a URL parameter
  [
    validarJWT,
    validarUser,
    check("id", "El id no es un formato valido de MongoDB").isMongoId(),
    check("id").custom(existePublicById),
    validarCampos,
  ], publicPut);

router.delete(
  "/:id",
  [
    validarJWT,
    validarUser,
    check("id", "El id no es un formato valido de MongoDB").isMongoId(),
    check("id").custom(existePublicById),
    validarCampos,
  ], publicDelete);

router.post(
  "/comment",
  [
    validarJWT,
    check("idPublications", "El id no es un formato valido de MongoDB").isMongoId(),
    check("idPublications").custom(existePublicById),
    check("text", "The comment text is mandatory").not().isEmpty(),
    validarCampos,
  ],
  addComment
);

// New route for updating a comment
router.put(
  "/comment/:id",
  [
    validarJWT,
    check("id", "El id no es un formato valido de MongoDB").isMongoId(),
    check("id").custom(existePublicById),
    check("commentId", "El commentId no es un formato valido de MongoDB").isMongoId(),
    check("text", "The comment text is mandatory").not().isEmpty(),
    validarCampos,
    validateUpdateComment,
  ],
  updateComment
);

// New route for deleting a comment
router.delete(
  "/:id/comment",
  [
    validarJWT,
    check("id", "El id no es un formato valido de MongoDB").isMongoId(),
    check("id").custom(existePublicById),
    check("commentId", "El commentId no es un formato valido de MongoDB").isMongoId(),
    validarCampos,
    validatePublicComentD,
  ],
  deleteComment
);

// New route for getting comments of a publication
router.get(
  "/:id",
  [
    check("id", "El id no es un formato valido de MongoDB").isMongoId(),
    check("id").custom(existePublicById),
    validarCampos,
    
  ],
  getComments
);

export default router;