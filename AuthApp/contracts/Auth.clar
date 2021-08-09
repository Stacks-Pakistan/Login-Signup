;; Data Maps & Vars
(define-map userData-map { username: (string-ascii 15) } { password: (string-ascii 15) }  )

;; Error Constants
(define-constant ERR_WRONG_USERNAME_PASSWORD false)
(define-constant ERR_USER_EXISTS false)

(define-public (login-check (user-name (string-ascii 15)) (user-password (string-ascii 15)))
  (let
    (
     ;; get stored password if user exists else return false
     (correct-password (get password (unwrap! (map-get? userData-map { username: user-name }) (err ERR_WRONG_USERNAME_PASSWORD))))
    )

    ;; return true if password matches else false
    (asserts! (is-eq correct-password user-password) (err ERR_WRONG_USERNAME_PASSWORD))
    (ok true)
  )
)

;; Returns true if credentials added successfully else false
(define-public (sign-up (user-name (string-ascii 15)) (user-password (string-ascii 15)))
    (begin
      ;; if user already exists then return false 
     (asserts! (is-eq (is-some (get password (map-get? userData-map { username: user-name }))) false) (err ERR_USER_EXISTS))
     
     ;; else store credentials
     (ok (map-insert userData-map { username: user-name  } { password: user-password }))
    ) 
)


;; Returns true if successfully changed, else error
(define-public (change-password (user-name (string-ascii 15)) (new-password (string-ascii 15)))
  (let
    (
      ;; if username is wrong then return false
     (is-exists (get password (unwrap! (map-get? userData-map { username: user-name  }) (err ERR_WRONG_USERNAME_PASSWORD))))
    )

    ;; else change password and return 
    (ok (map-set userData-map { username: user-name  } { password: new-password }))
  )
)


