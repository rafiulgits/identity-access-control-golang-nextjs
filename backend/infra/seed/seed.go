package seed

import (
	"github.com/rafiulgits/identity-access-control/infra"
	"github.com/rafiulgits/identity-access-control/models/domains"
	"github.com/rafiulgits/identity-access-control/util"
	"gorm.io/gorm"
)

func MasterData() error {
	var crud = []string{util.AccessCreate, util.AccessRead, util.AccessUpdate, util.AccessDelete}

	masterAccount := &domains.Account{AuthProvider: util.AuthProviderCredential, Name: "admin"}
	masterAccount.SetPassword("admin")

	masterUser := &domains.User{Name: "Admin"}

	masterPolicy := &domains.Policy{
		Name: "Master Admin",
		Permissions: []domains.Permission{
			{
				Access: crud,
				Module: util.VendorModuleName,
			},
			{
				Access: crud,
				Module: util.CustomerModuleName,
			},
			{
				Access: crud,
				Module: util.PolicyModuleName,
			},
			{
				Access: crud,
				Module: util.UserModuleName,
			},
			{
				Access: crud,
				Module: util.ProductModuleName,
			},
		}}

	txnErr := infra.GetInfra().GetDatabase().Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(masterUser).Error; err != nil {
			return err
		}

		masterAccount.UserID = masterUser.ID
		if err := tx.Save(masterAccount).Error; err != nil {
			return err
		}

		if err := tx.Create(masterPolicy).Error; err != nil {
			return err
		}

		userPolicy := &domains.UserPolicy{UserID: masterUser.ID, PolicyID: masterPolicy.ID}
		if err := tx.Create(userPolicy).Error; err != nil {
			return err
		}
		return nil
	})

	return txnErr
}
